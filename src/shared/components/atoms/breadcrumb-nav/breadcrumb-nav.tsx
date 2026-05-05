"use client"

import Link from "next/link"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/src/shared/components/ui/breadcrumb"

interface BreadcrumbNavProps {
    courseName: string
    parentLabel?: string
    parentHref?: string
}

export function BreadcrumbNav({ 
    courseName, 
    parentLabel = "Khóa học của tôi", 
    parentHref = "/student/courses" 
}: BreadcrumbNavProps) {
    return (
        <Breadcrumb className="mb-6">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href={parentHref}>{parentLabel}</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>{courseName}</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    )
}