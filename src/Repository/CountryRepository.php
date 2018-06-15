<?php

namespace App\Repository;

use App\Entity\Country;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method Country|null find($id, $lockMode = null, $lockVersion = null)
 * @method Country|null findOneBy(array $criteria, array $orderBy = null)
 * @method Country[]    findAll()
 * @method Country[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CountryRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Country::class);
    }

    public function search($dist=null, $lat=null, $long=null, $dens=null, $tempAvg=null, $lang1=null,$lang2=null,$lang3=null,$cont=null, $devise=null){
        //($dist=null, $lat=null, $long=null, $dens=null, $tempAvg=null $lang1=null,$lang2=null,$lang3=null, $cont=null, $devise=null)
        //DEMO
        $pourcentageMinLang = 20; //50%
        $toleranceTemp =2;
        $toleranceDensite =20;
/*
        $dist=null; //radio
        $lat=null;
        $long=null;
        $dens=null; //radio
        $tempAvg=null;//text
        $lang1=null;//checkbox
        $lang2=null;
        $lang3=null;
        $cont = 'Europe';//radio
        $devise = null;//radio
        //FIN DEMO
*/

        $qb=$this->createQueryBuilder('c');
        $qb->addSelect('ci');
        $qb->join('c.capital', 'ci');
        $qb->addSelect('la');
        $qb->join('c.id2', 'la');


        if(!is_null($dist)){
            $qb->andWhere('((SQRT(((:latStart-ci.latitude)*(:latStart-ci.latitude))+((:longStart-ci.longitude)*(:longStart-ci.longitude)))*111.16)<:dist)');
            $qb->setParameter('latStart', $lat);
            $qb->setParameter('longStart', $long);
            $qb->setParameter('dist', $dist);

            //Formule du calcul de distance : sqrt((lat1-lat2)²+(long1-long2)²)
            /*
             * ((SQRT(((:latStart-ci.latitude)*(:latStart-ci.latitude))+((:longStart-ci.longitude)*(:longStart-ci.longitude)))*111.16)<:dist)
             */
        }
        if(!is_null($dens)){
            $densMin = $dens -$toleranceDensite;
            $densMax =$dens +$toleranceDensite;
            $qb->andWhere('(c.population/c.area)> :densMin AND (c.population/c.area) < :densMax');
            $qb->setParameter('densMin', $densMin);
            $qb->setParameter('densMax', $densMax);

        }
        if(!is_null($tempAvg)){
            $tempMin = $tempAvg-$toleranceTemp;
            $tempMax = $tempAvg+$toleranceTemp;
            $qb->andWhere('c.temp_average > :tempMin AND c.temp_average < :tempMax');
            $qb->setParameter('tempMin', $tempMin);
            $qb->setParameter('tempMax', $tempMax);

        }
        if(!empty($cont)){
            $qb->andWhere('c.continent = :cont');
            $qb->setParameter('cont', $cont);
        }

        if(!empty($devise)){
            $qb->andWhere('c.money_id = :devise');
            $qb->setParameter('devise', $devise);
        }

        if(!empty($lang3)){
            $qb->andWhere('(la.language = :lang3 OR la.language= :lang2 OR la.language = :lang1) AND la.percentage > :pourcentageMinLang');
            $qb->setParameter('lang3', $lang3);
            $qb->setParameter('lang2', $lang2);
            $qb->setParameter('lang1', $lang1);
            $qb->setParameter('pourcentageMinLang', $pourcentageMinLang);
        }
        elseif (!empty($lang2)){

            $qb->andWhere("(la.language = :lang2 OR la.language = :lang1) AND la.percentage > :pourcentageMinLang");
            $qb->setParameter('lang2', $lang2);
            $qb->setParameter('lang1', $lang1);
            $qb->setParameter('pourcentageMinLang', $pourcentageMinLang);
        }
        elseif(!empty($lang1)){
            $qb->andWhere('la.language = :lang1 AND la.percentage > :pourcentageMinLang');
            $qb->setParameter('lang1', $lang1);
            $qb->setParameter('pourcentageMinLang', $pourcentageMinLang);
        }

        $query = $qb->getQuery();
        $results = $query->getResult();
        return $results;
    }
//    /**
//     * @return Country[] Returns an array of Country objects
//     */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('c.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Country
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
