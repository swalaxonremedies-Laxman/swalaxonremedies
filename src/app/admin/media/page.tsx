
'use client';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, Copy } from 'lucide-react';
import { uploadImageAction } from './action';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Uploading...' : 'Upload Image'}
    </Button>
  );
}

const initialState = {
  imageUrl: null,
  error: null,
};

export default function MediaPage() {
  const [state, formAction] = useActionState(uploadImageAction, initialState);
  const { toast } = useToast();

  const handleCopy = () => {
    if (state.imageUrl) {
      navigator.clipboard.writeText(state.imageUrl);
      toast({
        title: 'Copied to Clipboard!',
        description: 'The image URL has been copied.',
      });
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-headline">Media Uploader</h1>
        <p className="text-muted-foreground">Upload images and get a shareable URL.</p>
      </div>

      <form action={formAction}>
        <Card>
          <CardHeader>
            <CardTitle>Upload Image</CardTitle>
            <CardDescription>
              Select an image file from your device to upload it.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="image">Image File</Label>
              <Input id="image" name="image" type="file" accept="image/png, image/jpeg, image/webp, image/svg+xml, image/gif" required />
              <p className="text-sm text-muted-foreground">
                Supported formats: PNG, JPG, WEBP, SVG, GIF etc.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </Card>
      </form>
       {state?.error && (
        <Alert variant="destructive">
          <AlertTitle>An Error Occurred</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {state?.imageUrl && (
        <Alert>
          <UploadCloud className="h-4 w-4" />
          <AlertTitle>Upload Successful!</AlertTitle>
          <AlertDescription className="mt-2">
            <p>You can now use this URL in the application:</p>
            <div className="mt-2 flex items-center gap-2 rounded-md bg-muted p-2">
              <code className="text-sm break-all flex-1">{state.imageUrl}</code>
              <Button variant="ghost" size="icon" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy URL</span>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
