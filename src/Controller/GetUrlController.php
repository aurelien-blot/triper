<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Users;
use App\Entity\URL;


class GetUrlController extends Controller
{
    /**
     * @Route("/url/api/v1", name="url")
     */
        public function index(Request $request)
    {
        $url= new URL();
        $getUrl =$request->get('destId');
        $userId =$request->get('userId');

        $UsersRepo = $this->getDoctrine()->getRepository(Users::class);
        $users = $UsersRepo->findOneById($userId);


        $url->setUser($users);
        $url->setUrl($getUrl);

        $em = $this->getDoctrine()->getManager();
        $em->persist($url);
        $em->flush();

        return $this->json([
            "status"=>"ok",
            "message"=>"bien enregistré en base"]);

    }
}
