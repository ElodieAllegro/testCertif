<?php

namespace App\Controller\Admin;


use App\Entity\Colors;
use App\Form\ColorsFormType;
use App\Repository\ColorsRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/admin/taille', name: 'admin_colors_')]
class ColorsController extends AbstractController
{
   
    #[Route('/', name: 'index')]
    public function index(ColorsRepository $ColorsRepository): Response
    {
        $colors = $ColorsRepository->findAll();
        return $this->render('admin/colors/index.html.twig', compact('colors'));
    }

    #[Route('/ajout', name: 'add')]
    public function add(Request $request, EntityManagerInterface $em, SluggerInterface $slugger): Response
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        //On crée une nouvelle "taille "
        $color = new Colors();

        // On crée le formulaire
        $colorForm = $this->createForm(ColorsFormType::class, $color);

        // On traite la requête du formulaire
        $colorForm->handleRequest($request);

        //On vérifie si le formulaire est soumis ET valide
        if($colorForm->isSubmitted() && $colorForm->isValid()){

            
        
            // On stocke
            
            $em->persist($color);
            $em->flush();
            

            $this->addFlash('success', 'couleur ajouté avec succès');

            // On redirige
            return $this->redirectToRoute('admin_colors_index');
        }

        return $this->renderForm('admin/colors/add.html.twig', compact('colorForm'));
       
    }

    #[Route('/edition/{id}', name: 'edit')]
    public function edit(Colors $color, Request $request, EntityManagerInterface $em, SluggerInterface $slugger): Response
    {
        // On vérifie si l'utilisateur peut éditer avec le Voter
        $this->denyAccessUnlessGranted('PRODUCT_EDIT', $color);

      

        // On crée le formulaire
        $colorForm = $this->createForm(ColorsFormType::class, $color);

        // On traite la requête du formulaire
        $colorForm->handleRequest($request);

        //On vérifie si le formulaire est soumis et si il est valide
        if($colorForm->isSubmitted() && $colorForm->isValid()){
           
            
            // On stocke en bdd
            $em->persist($color);
            $em->flush();

            $this->addFlash('success', 'couleur modifié avec succès');

            // On redirige
            return $this->redirectToRoute('admin_colors_index');
        }

        
        return $this->render('admin/colors/edit.html.twig',[
            'colorForm' => $colorForm->createView(),
            'color' => $color
        ]);
        
    }

    #[Route('/suppression/{id}', name: 'delete')]
    public function delete(Colors $color, EntityManagerInterface $em): Response
    {
        $em->remove($color);
        $em->flush();
    
    
        return $this->redirectToRoute('admin_colors_index');
    }


}


