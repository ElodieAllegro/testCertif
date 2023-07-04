<?php

namespace App\Controller\Admin;


use App\Entity\Sizes;
use App\Form\SizesFormType;
use App\Service\PictureService;
use App\Repository\SizesRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/admin/taille', name: 'admin_sizes_')]
class SizesController extends AbstractController
{
   
    #[Route('/', name: 'index')]
    public function index(SizesRepository $SizesRepository): Response
    {
        $sizes = $SizesRepository->findAll();
        return $this->render('admin/sizes/index.html.twig', compact('sizes'));
    }

    #[Route('/ajout', name: 'add')]
    public function add(Request $request, EntityManagerInterface $em, SluggerInterface $slugger): Response
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        //On crée une nouvelle "taille "
        $size = new Sizes();

        // On crée le formulaire
        $sizeForm = $this->createForm(SizesFormType::class, $size);

        // On traite la requête du formulaire
        $sizeForm->handleRequest($request);

        //On vérifie si le formulaire est soumis ET valide
        if($sizeForm->isSubmitted() && $sizeForm->isValid()){

            
        
            // On stocke
            
            $em->persist($size);
            $em->flush();
            

            $this->addFlash('success', 'taille ajouté avec succès');

            // On redirige
            return $this->redirectToRoute('admin_sizes_index');
        }

        return $this->renderForm('admin/sizes/add.html.twig', compact('sizeForm'));
       
    }

    #[Route('/edition/{id}', name: 'edit')]
    public function edit(Sizes $size, Request $request, EntityManagerInterface $em, SluggerInterface $slugger, PictureService $pictureService): Response
    {
        // On vérifie si l'utilisateur peut éditer avec le Voter
        $this->denyAccessUnlessGranted('PRODUCT_EDIT', $size);

      

        // On crée le formulaire
        $sizeForm = $this->createForm(SizesFormType::class, $size);

        // On traite la requête du formulaire
        $sizeForm->handleRequest($request);

        //On vérifie si le formulaire est soumis et si il est valide
        if($sizeForm->isSubmitted() && $sizeForm->isValid()){
           
            
            // On stocke en bdd
            $em->persist($size);
            $em->flush();

            $this->addFlash('success', 'taille  modifié avec succès');

            // On redirige
            return $this->redirectToRoute('admin_sizes_index');
        }

        
        return $this->render('admin/sizes/edit.html.twig',[
            'sizeForm' => $sizeForm->createView(),
            'size' => $size
        ]);
        
    }

    #[Route('/suppression/{id}', name: 'delete')]
    public function delete(Sizes $size, EntityManagerInterface $em): Response
    {
        $em->remove($size);
        $em->flush();
    
    
        return $this->redirectToRoute('admin_sizes_index');
    }


}


