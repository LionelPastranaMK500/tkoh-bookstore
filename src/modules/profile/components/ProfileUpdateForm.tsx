// src/modules/profile/components/ProfileUpdateForm.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import {
  profileUpdateSchema,
  type ProfileUpdateFormValues,
} from '@/services/types/profile/ProfileUpdateSchema';
import { useUpdateMyProfile } from '@/services/profile/profileApi';
import type { User } from '@/services/types/User';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { Loader2 } from 'lucide-react';

interface ProfileUpdateFormProps {
  user: User;
}

export const ProfileUpdateForm: React.FC<ProfileUpdateFormProps> = ({
  user,
}) => {
  const { mutate: updateProfile, isPending } = useUpdateMyProfile();

  const form = useForm<ProfileUpdateFormValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      nombreUsuario: user.nombreUsuario,
      celular: user.celular || '',
    },
  });

  // Resetea el formulario si el usuario (de la query) cambia
  useEffect(() => {
    form.reset({
      nombreUsuario: user.nombreUsuario,
      celular: user.celular || '',
    });
  }, [user, form]);

  const onSubmit = (values: ProfileUpdateFormValues) => {
    toast.info('Actualizando perfil...');
    updateProfile(values, {
      onSuccess: () => {
        toast.success('Perfil actualizado con éxito.');
      },
      onError: (error: any) => {
        const apiError =
          error.response?.data?.message || 'No se pudo actualizar.';
        toast.error(apiError);
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil Público</CardTitle>
        <CardDescription>
          Actualiza tu nombre de usuario y celular.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="nombreUsuario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de Usuario</FormLabel>
                  <FormControl>
                    <Input placeholder="Tu nombre..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="celular"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Celular</FormLabel>
                  <FormControl>
                    <Input placeholder="987654321" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar Cambios
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
