"use client";

import Link from "next/link";
import { useState } from "react";

import { Menu } from "lucide-react";

import { Button } from "@/src/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/src/shared/components/ui/dialog";

import type { MenuButtonProps } from "./type";

export default function MenuButton({ menu, children }: MenuButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={false}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="w-20 h-20">
          <Menu className="w-16! h-16!" />
        </Button>
      </DialogTrigger>
      <DialogTitle></DialogTitle>
      <DialogContent
        className="w-full h-full max-w-full bg-secondary-foreground/80 p-0 border-0 
        **:data-[slot=dialog-close]:p-4
        **:data-[slot=dialog-close]:rounded-xl
        **:data-[slot=dialog-close]:top-6
        **:data-[slot=dialog-close]:right-6
        [&_[data-slot=dialog-close]_svg]:size-10!"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <nav className="flex flex-col text-center gap-4 mt-10 px-6">
          {menu?.map(({ key, trigger, href, content }) => (
            <div key={key} className="w-full text-left">
              {href ? (
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className="text-3xl font-semibold mb-5 hover:underline pb-4 block"
                >
                  {trigger}
                </Link>
              ) : (
                <div className="text-3xl font-semibold mb-5 hover:underline pb-4">
                  {trigger}
                </div>
              )}
              {content && content.length > 0 && (
                <div className="flex flex-col gap-2">
                  {content?.map(({ href, element }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setOpen(false)}
                      className="px-3 py-2 rounded-lg hover:bg-foreground/10"
                    >
                      {element}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          {children && (
            <div className="mt-6 flex flex-col items-center gap-4 w-full">
              {children}
            </div>
          )}
        </nav>
      </DialogContent>
    </Dialog>
  );
}
