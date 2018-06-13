<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Users;

class LoginController extends Controller
{
    /**
     * @Route("/login/api/v1", name="login")
     */
    //methods={"POST"}
    public function index(Request $request)
    {

        $login = $request->get('login');
        $pwd = sha1($request->get('pwd').'00x!');
        //$login = "Monnerie";
        //$pwd = sha1("test".'00x!');

        $usersRepo = $this->getDoctrine()->getRepository(Users::class);
        $users = $usersRepo->findOneByPseudo($login);



        if( empty($users)  ){
            return $this->json([
                "status"=>"KO",
                "message"=>"utilisateur inconnu",
            ]);


        }elseif ( $pwd != $users->getPassword() ){
            return $this->json([
                "status"=>"KO",
                "message"=>"mot de passe incorrect",
            ]);


        } else{

            return $this->json([
                "status"=>"OK",
                "message"=>"Vous êtes bien connecté",
                "data" => $users,
            ]);
        }


    }
}
