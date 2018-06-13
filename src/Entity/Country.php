<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
/**
 * @ORM\Entity(repositoryClass="App\Repository\CountryRepository")
 */
class Country implements \JsonSerializable
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     *
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=35)
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=5, nullable=true)
     */
    private $code;

    /**
     * @ORM\OneToOne(targetEntity="City")
     * @ORM\JoinColumn(name="capital", nullable=true)
     *
     */
    private $capital;

    /**
     * @ORM\Column(type="float")
     */
    private $area;

    /**
     * @ORM\Column(type="integer")
     */
    private $population;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private $temp_min_average;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private $temp_max_average;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private $temp_average;

    /**
     * @ORM\Column(type="string", length=4, nullable=true)
     */
    private $iso3;

    /**
     * @ORM\OneToMany(targetEntity="Language", mappedBy="country_id")
     */
    private $id2;

    /**
     * @ORM\ManyToOne(targetEntity="Continent")
     */
    private $continent;

    /**
     * @ORM\ManyToOne(targetEntity="Money")
     * @ORM\JoinColumn(name="money_id")
     */
    private $money_id;

    /**
     * @ORM\Column(type="string", length=4, nullable=true)
     */
    private $iso2;

    public function getId()
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getCode(): ?string
    {
        return $this->code;
    }

    public function setCode(string $code): self
    {
        $this->code = $code;

        return $this;
    }

    public function getCapital()
    {
        return $this->capital;
    }

    public function setCapital(integer $capital): self
    {
        $this->capital = $capital;

        return $this;
    }

    public function getArea(): ?float
    {
        return $this->area;
    }

    public function setArea(float $area): self
    {
        $this->area = $area;

        return $this;
    }

    public function getPopulation(): ?int
    {
        return $this->population;
    }

    public function setPopulation(int $population): self
    {
        $this->population = $population;

        return $this;
    }

    public function getTempMinAverage(): ?float
    {
        return $this->temp_min_average;
    }

    public function setTempMinAverage(?float $temp_min_average): self
    {
        $this->temp_min_average = $temp_min_average;

        return $this;
    }

    public function getTempMaxAverage(): ?float
    {
        return $this->temp_max_average;
    }

    public function setTempMaxAverage(?float $temp_max_average): self
    {
        $this->temp_max_average = $temp_max_average;

        return $this;
    }

    public function getTempAverage(): ?float
    {
        return $this->temp_average;
    }

    public function setTempAverage(?float $temp_average): self
    {
        $this->temp_average = $temp_average;

        return $this;
    }

    public function jsonSerialize()
    {
        // TODO: Implement jsonSerialize() method.


        return[
            "id"=>$this->getId(),
            "name"=> $this->getName(),
            "capitale"=>$this->getCapital()->getName(),
            "area"=>$this->getArea(),
            "population"=>$this->getPopulation(),
            "température minimum moyenne"=>$this->getTempMinAverage(),
            "température maximum moyenne"=>$this->getTempMaxAverage(),
            "température moyenne"=>$this->getTempAverage(),
            "densite"=>intval($this->getPopulation()/$this->getArea()),
            "continent"=>$this->getContinent()->getName(),
            "devise"=>$this->getMoneyId()->getName(),
            "iso2"=>$this->getIso2(),
            "iso3"=>$this->getIso3(),
            "code"=>$this->getCode()
        ];
    }

    public function getIso3(): ?string
    {
        return $this->iso3;
    }

    public function setIso3(?string $iso3): self
    {
        $this->iso3 = $iso3;

        return $this;
    }

    public function getId2(): ?int
    {
        return $this->id2;
    }

    public function setId2(?int $id2): self
    {
        $this->id2 = $id2;

        return $this;
    }

    public function getContinent()
    {
        return $this->continent;
    }

    public function setContinent( $continent): self
    {
        $this->continent = $continent;

        return $this;
    }

    public function getMoneyId()
    {
        return $this->money_id;
    }

    public function setMoneyId($money_id): self
    {
        $this->money_id = $money_id;

        return $this;
    }

    public function getIso2(): ?string
    {
        return $this->iso2;
    }

    public function setIso2(?string $iso2): self
    {
        $this->iso2 = $iso2;

        return $this;
    }
}
