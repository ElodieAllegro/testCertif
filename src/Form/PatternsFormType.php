<?php

namespace App\Form;

use App\Entity\Patterns;
use Doctrine\ORM\Mapping\Entity;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Validator\Constraints\Image;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\FileType;


class PatternsFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('ref', options:[
                'label' => 'Reference'
            ])

            ->add('images', FileType::class,[
                'label'=> false,
                'multiple'=> true,
                'mapped' => false,
                'required' => false,
                // 'constraints' => [
                //     new All(
                //         new Image(['maxWidth'=> 1280,
                //     'maxWidthMessage'=> 'L\'image doit faire
                //     {{max_width}} pixels de large au maximum'
                //     ]))
                    
               //
            ]);
    }    

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Patterns::class,
        ])
        ;
    }
}