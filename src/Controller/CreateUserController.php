<?php

namespace App\Controller;

use App\Entity\Users;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class CreateUserController extends Controller
{
    /**
     * @Route("/create/api/v1", name="create")
     */
    public function index(Request $request)
    {
        $users = new Users();

        $nom = $request->get("nom");
        $prenom = $request->get("prenom");
        $pseudo = $request->get("pseudo");
        $mail = $request->get("mail");
        $pwd = sha1(($request->get("pwd")).'00x!');
/*
        $nom = 'api';
        $prenom = 'rene';
        $pseudo = 'api';
        $mail = 'eijfzojsf';
        $pwd = 'api';
*/
        $users->setNom($nom);
        $users->setPrenom($prenom);
        $users->setPseudo($pseudo);
        $users->setMail($mail);
        $users->setPassword($pwd);

        $em = $this->getDoctrine()->getManager();
        $em->persist($users);
        $em->flush();

        return $this->json([
        "status"=>"OK",
        "message"=>"Vous êtes bien inscrit",
        "data" => $users
        ]);
    }
}
