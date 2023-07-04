<?php

namespace App\Controller\Admin;


use App\Entity\Images;
use App\Entity\Patterns;
use App\Form\PatternsFormType;
use App\Service\PictureService;
use App\Repository\PatternsRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/admin/patterns', name: 'admin_patterns_')]
class PatternsController extends AbstractController
{
   
    #[Route('/', name: 'index')]
    public function index(PatternsRepository $patternsRepository): Response
    {
        $patterns = $patternsRepository->findAll();
        return $this->render('admin/patterns/index.html.twig', compact('patterns'));
    }

    #[Route('/ajout', name: 'add')]
    public function add(Request $request, EntityManagerInterface $em, SluggerInterface $slugger, PictureService $pictureService): Response
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        //On crée une "nouvelle pattern"
        $pattern = new Patterns();

        // On crée le formulaire
        $patternForm = $this->createForm(PatternsFormType::class, $pattern);

        // On traite la requête du formulaire
        $patternForm->handleRequest($request);

        //On vérifie si le formulaire est soumis ET valide
        if($patternForm->isSubmitted() && $patternForm->isValid()){

            
            // On récupère les images
            $images = $patternForm->get('images')->getData();
            
            foreach($images as $image){
                // On définit le dossier de destination
                $folder = 'patterns';

                // On appelle le service d'ajout
                $fichier = $pictureService->add($image, $folder, 80, 80);

                $img = new Images();
                $img->setName($fichier);
                $pattern->setImg($img);
            }

        
            // On stocke
            
            $em->persist($pattern);
            $em->flush();
            

            $this->addFlash('success', 'Produit ajouté avec succès');

            // On redirige
            return $this->redirectToRoute('admin_patterns_index');
        }

        return $this->renderForm('admin/patterns/add.html.twig', compact('patternForm'));
        // ['patternForm' => $patternForm]
    }

    #[Route('/edition/{id}', name: 'edit')]
    public function edit(Patterns $pattern, Request $request, EntityManagerInterface $em, SluggerInterface $slugger, PictureService $pictureService): Response
    {
        // On vérifie si l'utilisateur peut éditer avec le Voter
        $this->denyAccessUnlessGranted('PRODUCT_EDIT', $pattern);

      

        // On crée le formulaire
        $patternForm = $this->createForm(PatternsFormType::class, $pattern);

        // On traite la requête du formulaire
        $patternForm->handleRequest($request);

        //On vérifie si le formulaire est soumis et si il est valide
        if($patternForm->isSubmitted() && $patternForm->isValid()){
            // On récupère les images du formulaire
            $images = $patternForm->get('images')->getData();

            foreach($images as $image){
                // On définit le dossier de destination
                $folder = 'patterns';

                // On appelle le service d'ajout 
                $fichier = $pictureService->add($image, $folder, 300, 300);

                $img = new Images();
                $img->setName($fichier);
                $pattern->setImg($img);
            }
            
           


            // On stocke en bdd
            $em->persist($pattern);
            $em->flush();

            $this->addFlash('success', 'Pattern modifié avec succès');

            // On redirige
            return $this->redirectToRoute('admin_patterns_index');
        }

        
        return $this->render('admin/patterns/edit.html.twig',[
            'patternForm' => $patternForm->createView(),
            'pattern' => $pattern
        ]);
        
    }

    #[Route('/suppression/{id}', name: 'delete')]
    public function delete(Patterns $pattern, EntityManagerInterface $em): Response
    {
        $em->remove($pattern);
        $em->flush();
    
    
        return $this->redirectToRoute('admin_patterns_index');
    }

    #[Route('/suppression/image/{id}', name: 'delete_image', methods: ['DELETE'])]
    public function deleteImage(Images $image, Request $request, EntityManagerInterface $em, PictureService $pictureService): JsonResponse
    {
        // On récupère le contenu de la requête
        $data = json_decode($request->getContent(), true);

        if($this->isCsrfTokenValid('delete' . $image->getId(), $data['_token'])){
            // Le token csrf est valide
            // On récupère le nom de l'image
            $nom = $image->getName();

            if($pictureService->delete($nom, 'patterns', 300, 300)){
                // On supprime l'image de la base de données
                $em->remove($image);
                $em->flush();

                return new JsonResponse(['success' => true], 200);
            }
            // si La suppression a échoué message d'erreur
            return new JsonResponse(['error' => 'Erreur de suppression'], 400);
        }

        return new JsonResponse(['error' => 'Token invalide'], 400);
    }


}


