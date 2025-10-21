import {createFileRoute} from '@tanstack/react-router'
import {AppLayout} from "@/layouts/AppLayout.tsx";

export const Route = createFileRoute('/_basic-layout')({
    component: RouteComponent,
})

function RouteComponent() {
    return <AppLayout/>
}
