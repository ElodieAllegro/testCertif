<?php
namespace App\Controller;

use App\Entity\Images;
use App\Entity\Patterns;
use App\Entity\Products;
use App\Repository\ImagesRepository;
use Doctrine\ORM\Mapping\Id;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/getimage', name: '_index')]
class GetImagesController extends AbstractController
{
    #[Route('/{id}', name: 'get_image_by_id', methods: ['GET'])]
    public function index(ImagesRepository $imagesRepository, $id): Response
    {
        $image = $imagesRepository->find($id);
        
        if (!$image) {
            throw $this->createNotFoundException('Image not found');
        }
        
        $imageName = $image->getName();
        
        return new Response($imageName);
    }
}
