/* eslint-disable @typescript-eslint/no-explicit-any */
import { FileText, Download } from "lucide-react"
import { Card, CardContent } from "@/src/shared/components/ui/card"

interface RelatedDocumentsProps {
    documents: any[]
}

export function RelatedDocuments({ documents }: RelatedDocumentsProps) {
    return (
        <Card className="border-border">
            <CardContent className="p-6">
                <h3 className="font-bold text-foreground mb-4">
                    Tài liệu liên quan
                </h3>
                <div className="flex flex-col gap-4">
                    {documents.map((doc) => (
                        <a
                            key={doc.id}
                            href={doc.downloadUrl || "#"}
                            download
                            className="flex items-center gap-3 group outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
                        >
                            <div className="size-10 rounded-lg bg-orange-100 dark:bg-orange-950/30 text-orange-600 flex items-center justify-center group-hover:bg-orange-200 dark:group-hover:bg-orange-900/40 transition-colors flex-shrink-0">
                                <FileText className="size-5" />
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                                <span className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                                    {doc.title}
                                </span>
                                <span className="text-xs text-muted-foreground font-medium">{doc.fileSize}</span>
                            </div>
                            <Download className="size-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                        </a>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}