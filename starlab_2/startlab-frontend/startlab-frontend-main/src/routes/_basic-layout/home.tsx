import {createFileRoute} from '@tanstack/react-router'
import {HomePage} from '@/pages/HomePage.tsx'

export const Route = createFileRoute('/_basic-layout/home')({
    component: Home,
})

function Home() {
    return <HomePage/>
}