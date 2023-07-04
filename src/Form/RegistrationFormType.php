<?php
namespace App\Form;

use App\Entity\Users;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Validator\Constraints\IsTrue;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;

class RegistrationFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('email', EmailType::class, [
                'attr' => [
                    'class' => 'form-control',
                ],
                'label' => 'Adresse e-mail',
                'constraints' => [
                    new Email([
                        'message' => 'Veuillez entrer une adresse e-mail valide.',
                    ]),
                ],
            ])
            ->add('lastname', TextType::class, [
                'attr' => [
                    'class' => 'form-control',
                ],
                'label' => 'Nom',
                'constraints' => [
                    new NotBlank([
                        'message' => 'Veuillez entrer votre Nom.',
                    ]),
                ],
            ])
            ->add('firstname', TextType::class, [
                'attr' => [
                    'class' => 'form-control',
                ],
                'label' => 'Prénom',
                'constraints' => [
                    new NotBlank([
                        'message' => 'Veuillez entrer votre Prénom.',
                    ]),
                ],
            ])
            ->add('address', TextType::class, [
                'attr' => [
                    'class' => 'form-control',
                ],
                'label' => 'Adresse',
                'constraints' => [
                    new NotBlank([
                        'message' => 'Veuillez entrer votre adresse.',
                    ]),
                ],
            ])
            ->add('zipcode', TextType::class, [
                'attr' => [
                    'class' => 'form-control',
                ],
                'label' => 'Code postal',
                'constraints' => [
                    new NotBlank([
                        'message' => 'Veuillez entrer votre code postal.',
                    ]),
                ],
            ])
            ->add('city', TextType::class, [
                'attr' => [
                    'class' => 'form-control',
                ],
                'constraints' => [
                    new NotBlank([
                        'message' => 'Veuillez entrer votre ville.',
                    ]),
                    new Length([
                        'min' => 3,
                        'minMessage' => 'Votre ville doit avoir au moins {{ limit }} caractères.',
                        'max' => 300,
                    ]),
                ],
                'label' => 'Ville',
            ])
            ->add('RGPDConsent', CheckboxType::class, [
                'mapped' => false,
                'constraints' => [
                    new IsTrue([
                        'message' => 'Vous devez accepter les CGU.',
                    ]),
                ],
                'label' => 'En cochant cette case j\'accepte les conditions générales d\'utilisations.',
            ])
            ->add('plainPassword', PasswordType::class, [
                'mapped' => false,
                'attr' => [
                    'autocomplete' => 'new-password',
                    'class' => 'form-control',
                ],
                'constraints' => [
                    new NotBlank([
                        'message' => 'Veuillez entrer votre mot de passe.',
                    ]),
                    new Length([
                        'min' => 6,
                        'minMessage' => 'Votre mot de passe doit avoir au moins {{ limit }} caractères.',
                        'max' => 4096,
                    ]),
                ],
                'label' => 'Mot de passe',
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Users::class,
        ]);
    }
}

