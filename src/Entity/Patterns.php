<?php

namespace App\Entity;

use App\Repository\PatternsRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PatternsRepository::class)]
class Patterns
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;


    #[ORM\OneToOne(inversedBy: 'patterns', cascade: ['persist', 'remove'])]
    private ?Images $img = null;

    #[ORM\ManyToMany(targetEntity: Products::class, mappedBy: 'patterns')]
    private Collection $products;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $ref = null;

    #[ORM\OneToMany(mappedBy: 'patternName', targetEntity: Images::class)]
    private Collection $imagesName;


   

    public function __construct()
    {
        $this->products = new ArrayCollection();
        $this->imagesName = new ArrayCollection();
     
      
    }

    public function __toString()
    {
        return $this->ref;
        return $this->imagesName;
        
    }
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getImg(): ?Images
    {
        return $this->img;
    }

    public function setImg(?Images $img): static
    {
        $this->img = $img;

        return $this;
    }



    /**
     * @return Collection<int, Products>
     */
    public function getProducts(): Collection
    {
        return $this->products;
    }

    public function addProduct(Products $product): static
    {
        if (!$this->products->contains($product)) {
            $this->products->add($product);
            $product->addPattern($this);
        }

        return $this;
    }

    public function removeProduct(Products $product): static
    {
        if ($this->products->removeElement($product)) {
            $product->removePattern($this);
        }

        return $this;
    }

    public function getRef(): ?string
    {
        return $this->ref;
    }

    public function setRef(?string $ref): static
    {
        $this->ref = $ref;

        return $this;
    }

    /**
     * @return Collection<int, Images>
     */
    public function getImagesName(): Collection
    {
        return $this->imagesName;
    }

    public function addImagesName(Images $imagesName): static
    {
        if (!$this->imagesName->contains($imagesName)) {
            $this->imagesName->add($imagesName);
            $imagesName->setPatternName($this);
        }

        return $this;
    }

    public function removeImagesName(Images $imagesName): static
    {
        if ($this->imagesName->removeElement($imagesName)) {
            // set the owning side to null (unless already changed)
            if ($imagesName->getPatternName() === $this) {
                $imagesName->setPatternName(null);
            }
        }

        return $this;
    }

  

    
}
