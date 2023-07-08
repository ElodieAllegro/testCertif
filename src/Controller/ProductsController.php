<?php

namespace App\Controller;

use App\Entity\Products;
use App\Entity\Categories;
use App\Repository\ProductsRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/produits', name: 'products_')]
class ProductsController extends AbstractController
{
    #[Route('/', name: 'index')]
    public function index(ProductsRepository $productsRepository): Response
    {
        $products = $productsRepository->findAll();
        return $this->render('products/index.html.twig', compact('products'));
    }
    
    #[Route('/liste/{slug}', name: 'list')]
    public function list(Categories $category): Response
    {
        $products= $category->getProducts();
        return $this->render('products/list.html.twig', compact('category',
        'products'));
    }
    #[Route('/details/{slug}', name: 'details')]
    public function details(Products $product ): Response
    {
        return $this->render('products/details.html.twig', compact('product'));
    }

}

