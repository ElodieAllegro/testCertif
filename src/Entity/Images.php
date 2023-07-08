<?php

namespace App\Entity;

use App\Repository\ImagesRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ImagesRepository::class)]
class Images
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\ManyToOne(inversedBy: 'images')]
    #[ORM\JoinColumn(nullable: true)]
    private ?Products $products = null;

    #[ORM\OneToOne(mappedBy: 'img', cascade: ['persist', 'remove'])]
    private ?Patterns $patterns = null;

    #[ORM\ManyToOne(inversedBy: 'imagesName')]
    private ?Patterns $patternName = null;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $reference = null;


    public function __toString()
    {
        return $this->name;
        return $this->patternName;
    }
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getProducts(): ?Products
    {
        return $this->products;
    }

    public function setProducts(?Products $products): static
    {
        $this->products = $products;

        return $this;
    }

    public function getPatterns(): ?Patterns
    {
        return $this->patterns;
    }

    public function setPatterns(?Patterns $patterns): static
    {
        // unset the owning side of the relation if necessary
        if ($patterns === null && $this->patterns !== null) {
            $this->patterns->setImg(null);
        }

        // set the owning side of the relation if necessary
        if ($patterns !== null && $patterns->getImg() !== $this) {
            $patterns->setImg($this);
        }

        $this->patterns = $patterns;

        return $this;
    }

    public function getPatternName(): ?Patterns
    {
        return $this->patternName;
    }

    public function setPatternName(?Patterns $patternName): static
    {
        $this->patternName = $patternName;

        return $this;
    }

    public function getReference(): ?string
    {
        return $this->reference;
    }

    public function setReference(?string $reference): static
    {
        $this->reference = $reference;

        return $this;
    }
}
