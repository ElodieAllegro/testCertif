<?php

namespace App\Controller;

use App\Entity\Users;
use App\Form\RegistrationFormType;
use App\Security\UsersAuthenticator;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\UserAuthenticatorInterface;

class RegistrationController extends AbstractController
{
    #[Route('/inscription', name: 'app_register')]
    public function register(Request $request, UserPasswordHasherInterface $userPasswordHasher,
    UserAuthenticatorInterface $userAuthenticator, 
    UsersAuthenticator $authenticator, EntityManagerInterface $entityManager): Response
    {
        //Je créé un nouvel utilisateur
        $user = new Users();
        //je crée le formulaire 
        $form = $this->createForm(RegistrationFormType::class, $user);
        //je gère le formulaire
        $form->handleRequest($request);
        // si le formulaire est bon
        if ($form->isSubmitted() && $form->isValid()) {
            //je gère l'inscription
            // encode the plain password
            $user->setPassword(
                //hache le mot de passe
                $userPasswordHasher->hashPassword(
                    $user,
                    $form->get('plainPassword')->getData()
                )
            );

            $entityManager->persist($user);
            $entityManager->flush();
            // do anything else you need here, like send an email

            return $userAuthenticator->authenticateUser(
                $user,
                $authenticator,
                $request
            );
        }

        return $this->render('registration/register.html.twig', [
            'registrationForm' => $form->createView(),
        ]);
    }
}
