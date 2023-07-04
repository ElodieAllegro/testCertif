<?php

namespace App\Controller;

use App\Entity\Categories;
use App\Repository\CategoriesRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/categories', name: 'app_categories_')]
class CategoriesController extends AbstractController
{
    #[Route('/', name: '_index')]
    public function index(CategoriesRepository $categoriesRepository): Response
    {
        $categories = $categoriesRepository->findBy([], ['categoryOrder' => 'asc']);

        return $this->render('categories/index.html.twig', compact('categories'));
    }

    #[Route('/{slug}', name: 'list')]
    public function list(Categories $category, CategoriesRepository $categoriesRepository): Response
    {
        $categories = $categoriesRepository->findAll();

        return $this->render('categories/list.html.twig', [
            'category' => $category,
            'categories' => $categories
        ]);
    }
}


    






    
  




    // #[Route('/{slug}', name: 'list')]
    // public function list(Categories $category, ProductsRepository $productsRepository): Response
    // {
    //     $products = $productsRepository->findBy(['categories' => $category]);

    //     return $this->render('categories/list.html.twig', [
    //         'category' => $category,
    //         'products' => $products
    //     ]);
    // }













// #[Route('/categories', name: 'app_categories_')]
// class CategoriesController extends AbstractController
// {
//     #[Route('/', name: '_index')]
//     public function index(CategoriesRepository $categoriesRepository): Response
//     {
//         $categories = $categoriesRepository->findBy([], ['categoryOrder' => 'asc']);

//         return $this->render('categories/index.html.twig', compact('categories'));
//     }

//     #[Route('/{slug}', name: 'list')]
//     public function list(Categories $category): Response
//     {
//         return $this->render('categories/list.html.twig', [
//             'category' => $category
//         ]);
//     }
// }








// namespace App\Controller;

// use App\Entity\Categories;
// use Symfony\Component\HttpFoundation\Response;
// use Symfony\Component\Routing\Annotation\Route;
// use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;



// #[Route('/categories', name: 'categories_')]

// class CategoriesController extends AbstractController
// {
//     #[Route('/{slug}', name: 'list')]
//     public function list(Categories $category): Response
//     {
//         $products= $category->getProducts();
//         return $this->render('categories/list.html.twig', compact('category',
//     'products'));
// }

// }