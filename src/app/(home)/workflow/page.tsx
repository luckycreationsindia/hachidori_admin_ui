'use client';

import {ColumnDef} from "@tanstack/react-table";
import {Workflow, WorkflowListResponse} from "@/interfaces/workflow";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";
import {DataTable} from "@/components/ui/data-table";
import {useEffect, useState} from "react";
import {toast} from "sonner";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const WorkflowPage = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [workflows, setWorkflows] = useState<Workflow[]>([]);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [workflowToDelete, setWorkflowToDelete] = useState<number | null>(null);

    const fetchWorkflows = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/workflow');
            if (!response.ok) {
                throw new Error('Failed to fetch workflows');
            }
            const data = await response.json() as WorkflowListResponse;
            if(data.status === 1) {
                setWorkflows(data.data);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Failed to fetch workflows');
            console.error('Error fetching workflows:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchWorkflows();
    }, []);

    const handleEditClick = async (data: Workflow) => {
        console.log(data);
    }

    const handleDeleteClick = async () => {
        if (!workflowToDelete) {
            toast.error('No workflow selected for deletion');
            return;
        }
        setIsDeleting(true);
        try {
            const response = await fetch(`/api/workflow/${workflowToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to delete workflow');
            } else {
                toast.success('Workflow deleted successfully');
                setWorkflows(workflows.filter(workflow => workflow.id !== workflowToDelete));
                setShowDeleteModal(false);
                setWorkflowToDelete(null);
            }
        } catch (error) {
            toast.error('Failed to delete workflow');
            console.error('Error deleting workflow:', error);
        } finally {
            setIsDeleting(false);
        }
    }

    const columns: ColumnDef<Workflow>[] = [
        {
            accessorKey: "title",
            header: "Title",
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({row}) => {
                const data = row.original;
                return (
                    <div className="flex gap-2">
                        <Button className="hidden" variant="outline" size="sm" onClick={() => handleEditClick(data)}>
                            Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => {
                            setWorkflowToDelete(data.id);
                            setShowDeleteModal(true);
                        }}>
                            Delete
                        </Button>
                    </div>
                );
            },
        },
    ];
    return (
        <div className="p-6">
            <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            workflow.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteClick} disabled={isDeleting}>
                            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            {loading ? (
                <div className="flex items-center justify-center p-10">
                    <Loader2 className="animate-spin" size={32}/>
                </div>
            ) : (
                <DataTable columns={columns} data={workflows}/>
            )}
        </div>
    );
};

export default WorkflowPage;