<?php

namespace App\Form;


use App\Entity\Sizes;
use App\Entity\Colors;
use App\Entity\Patterns;
use App\Entity\Products;
use App\Entity\Categories;
use App\Entity\Images;
use Doctrine\ORM\Mapping\Entity;
use App\Repository\CategoriesRepository;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Validator\Constraints\All;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Validator\Constraints\Image;
use Symfony\Component\Validator\Constraints\Positive;
use Symfony\Component\Validator\Constraints\Required;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\MoneyType;

class ProductsFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name', options:[
                'label' => 'Nom'
            ])
            ->add('description')
            
            ->add('price', MoneyType::class, options:[
                'label' => 'Prix',
                'divisor' => 100,
                'constraints' => [
                    new Positive(
                        message: 'Le prix ne peut être négatif'
                        )]
            ])
            ->add('stock', null, [
                'label' => 'Unités en stock'
            ])
            ->add('colors', EntityType::class, [
                'class' => Colors::class,
                'label' => 'Couleurs',
                'multiple' => true,
                'expanded' => true
            ])
            ->add('size', EntityType::class, [
                'class' => Sizes::class,
                'label' => 'taille',
                'multiple' => true,
                'expanded' => true
            ])
            ->add('patterns', EntityType::class, [
                'class' => Patterns::class,
                'label' => 'pattern',
                'multiple' => true,
                'expanded' => true
            ])
          
            ->add('categories', EntityType::class, [
                'class' => Categories::class,
                'choice_label' => 'name',
                'label' => 'Catégorie',
                'group_by' => 'parent.name'
            ])
            
            ->add('images', EntityType::class, [
                'class' => Images::class,
                'label' => 'pattern'   
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
            'data_class' => Products::class,
        ])
        ;
    }
}