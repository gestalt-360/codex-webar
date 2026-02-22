'use client';

import { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Download, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const schema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  image: z.any(),
  video: z.any()
});

type FormData = z.infer<typeof schema>;

type Result = {
  publicUrl: string;
  qrCodeDataUrl: string;
};

export function CreateProjectForm() {
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<FormData>();

  const onSubmit = form.handleSubmit(async (values) => {
    const valid = schema.safeParse(values);
    if (!valid.success) {
      setError(valid.error.issues[0]?.message ?? 'Dados inválidos');
      return;
    }
    setError(null);
    setResult(null);

    try {
      const payload = new FormData();
      payload.append('name', values.name);
      payload.append('image', values.image[0]);
      payload.append('video', values.video[0]);

      const response = await axios.post('/api/create', payload);
      setResult(response.data);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Erro ao criar experiência');
    }
  });

  return (
    <div className="mx-auto w-full max-w-2xl rounded-2xl border bg-white p-6 shadow-sm">
      <h1 className="mb-2 text-2xl font-bold">WebAR Studio</h1>
      <p className="mb-6 text-sm text-muted-foreground">Suba imagem + vídeo e gere um link AR público com QR Code.</p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do projeto</Label>
          <Input id="name" {...form.register('name')} placeholder="Campanha de verão" />
          <p className="text-xs text-red-500">{form.formState.errors.name?.message}</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Imagem trigger (JPG/PNG)</Label>
          <Input id="image" type="file" accept="image/png,image/jpeg" {...form.register('image')} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="video">Vídeo MP4 (máx 15MB)</Label>
          <Input id="video" type="file" accept="video/mp4" {...form.register('video')} />
        </div>

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Criar Experiência AR
        </Button>
      </form>

      {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}

      {result ? (
        <div className="mt-6 space-y-3 rounded-lg border p-4">
          <p className="text-sm font-semibold">Link público:</p>
          <a className="break-all text-sm text-blue-600 underline" href={result.publicUrl} target="_blank">
            {result.publicUrl}
          </a>
          <img src={result.qrCodeDataUrl} alt="QR Code" className="h-44 w-44 rounded-md border" />
          <a href={result.qrCodeDataUrl} download="webar-qrcode.png">
            <Button variant="outline" size="default">
              <Download className="mr-2 h-4 w-4" />
              Baixar QR Code
            </Button>
          </a>
        </div>
      ) : null}
    </div>
  );
}
