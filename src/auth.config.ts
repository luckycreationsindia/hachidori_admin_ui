import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {AuthUser, ProfileResponse, Role} from "@/interfaces/user";
import {ApiSuccessResponse} from "@/interfaces/api_response";
import {getIPFromRequest, getIPFromRequestHeaders} from "@/utils/utils";
import {LOGIN_URL, LOGOUT_URL, PROFILE_URL, REFRESH_TOKEN_URL} from "@/utils/api_consts";
import {NextRequest} from "next/server";

const fallbackOrigin = process.env.NEXTAUTH_URL!;

export function createAuthOptions(nextRequest: NextRequest): NextAuthOptions {
    return {
        providers: [
            CredentialsProvider({
                name: "Credentials",
                credentials: {
                    email: {label: "Email", type: "text", placeholder: "admin@example.com"},
                    password: {label: "Password", type: "password", placeholder: "********"}
                },
                async authorize(credentials, req) {
                    if (!credentials?.email || !credentials?.password) {
                        return null;
                    }

                    if (!credentials?.email || !credentials?.password) {
                        return null;
                    }

                    const ip = getIPFromRequestHeaders(req) || "127.0.0.1";
                    const realOrigin = req.headers?.['origin'] || fallbackOrigin;

                    try {
                        const response = await fetch(LOGIN_URL, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Origin": realOrigin,
                                'x-forwarded-for': ip,
                            },
                            body: JSON.stringify(credentials),
                            credentials: "include",
                        });

                        if (!response.ok) {
                            throw new Error("Invalid Credentials");
                        }

                        const setCookieHeaders = response.headers.getSetCookie().join('; ');
                        if (!setCookieHeaders) {
                            throw new Error("Invalid Credentials");
                        }

                        const loginResponse = await response.json() as ApiSuccessResponse;

                        if (loginResponse.status === 1) {
                            const response = await fetch(
                                PROFILE_URL,
                                {
                                    credentials: "include",
                                    headers: {
                                        'Origin': realOrigin,
                                        'Cookie': setCookieHeaders,
                                        'x-forwarded-for': ip,
                                    }
                                }
                            );

                            if (!response.ok) {
                                throw new Error("Invalid Credentials");
                            }

                            const data = await response.json() as ProfileResponse;

                            const user = data.data;
                            if (user && user.id && user.email && user.role === Role.ADMIN) {
                                return {
                                    id: user.id,
                                    name: user.name,
                                    email: user.email,
                                    role: user.role,
                                    cookies: setCookieHeaders,
                                } as AuthUser;
                            } else {
                                console.error("External API login successful but returned unexpected user data:", user);
                                throw new Error("Invalid Credentials");
                            }
                        } else {
                            console.error("External API login failed");
                            throw new Error("Invalid Credentials");
                        }
                    } catch (err) {
                        console.error(err);
                        throw new Error("Invalid Credentials");
                    }
                }
            })
        ],
        callbacks: {
            async jwt({token, user, trigger}) {
                if (trigger === "update") {
                    const ip = getIPFromRequest(nextRequest) || "127.0.0.1";
                    const realOrigin = nextRequest.headers.get('origin') || fallbackOrigin;
                    const response = await fetch(
                        REFRESH_TOKEN_URL,
                        {
                            method: "POST",
                            credentials: "include",
                            headers: {
                                'Origin': realOrigin,
                                'Cookie': token.cookies!,
                                'x-forwarded-for': ip
                            }
                        }
                    );
                    if (response.ok) {
                        const newCookies = response.headers.getSetCookie();
                        if (newCookies.length > 0) {
                            const cookieMap = new Map<string, string>();

                            if (token.cookies) {
                                token.cookies.split('; ').forEach(cookie => {
                                    const [name, ...rest] = cookie.split('=');
                                    cookieMap.set(name, rest.join('='));
                                });
                            }

                            newCookies.forEach(cookie => {
                                const [name, ...rest] = cookie.split(';')[0].split('=');
                                cookieMap.set(name, rest.join('='));
                            });

                            const mergedCookiesArray = Array.from(cookieMap.entries())
                                .map(([name, value]) => `${name}=${value}`);

                            token.cookies = mergedCookiesArray.join('; ');
                        }
                        return token;
                    }
                } else if (user) {
                    token.id = Number(user.id);
                    token.email = user.email;
                    token.name = user.name;
                    token.cookies = user.cookies;
                    token.role = user.role;
                }
                return token;
            },
            async session({session, token}) {
                if (token && session?.user) {
                    session.user.id = token.id;
                    session.user.email = token.email;
                    session.user.name = token.name;
                    session.user.role = token.role;
                }
                return session;
            }
        },
        session: {
            strategy: "jwt",
            maxAge: 24 * 60 * 60,
        },
        secret: process.env.NEXTAUTH_SECRET,
        pages: {
            signIn: "/login",
            error: "/login"
        },
        events: {
            async signOut({token}) {
                if (token.cookies) {
                    try {
                        const ip = getIPFromRequest(nextRequest) || "127.0.0.1";
                        const realOrigin = nextRequest.headers.get('origin') || fallbackOrigin;
                        await fetch(LOGOUT_URL, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                "Origin": realOrigin,
                                "Cookie": token.cookies,
                                'x-forwarded-for': ip
                            },
                            credentials: "include",
                        });
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    } catch (_) {
                        // console.error("Failed to clear external API session on signOut:", error);
                    }
                }
            }
        },
        debug: process.env.NODE_ENV === "development",
    }
}