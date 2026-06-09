import { Button } from '@/src/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/shared/components/ui/dialog';
import { Spinner } from '@/src/shared/components/ui/spinner';

import type { ModalPresenterProps } from './type';

const ModalPresenter = ({
  trigger,
  title,
  description,
  children,
  confirmText,
  cancelText = 'Cancel',
  formId = 'input-form',
  open,
  isSubmitting,
  onOpenChange,
  contentClassName,
  hideDefaultFooter,
  customHeader,
}: ModalPresenterProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className={contentClassName || "sm:max-w-[500px]"}>
        {customHeader ? (
          <>
            <DialogTitle className="sr-only">{title}</DialogTitle>
            <DialogDescription className="sr-only">{description}</DialogDescription>
            {customHeader}
          </>
        ) : (
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
        )}

        <div className="grid gap-4 py-4">{children}</div>

        {!hideDefaultFooter && (
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                {cancelText}
              </Button>
            </DialogClose>
            {confirmText && (
              <Button type="submit" form={formId} disabled={isSubmitting}>
                {isSubmitting ? <Spinner /> : confirmText}
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ModalPresenter;
