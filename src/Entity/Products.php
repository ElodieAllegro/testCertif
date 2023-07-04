<?php

namespace App\Entity;

use App\Entity\Trait\SlugTrait;
use Doctrine\ORM\Mapping as ORM;
use App\Entity\Trait\CreatedAtTrait;
use App\Repository\ProductsRepository;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;

#[ORM\Entity(repositoryClass: ProductsRepository::class)]
class Products
{
    use CreatedAtTrait;
    use SlugTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    private ?string $description = null;


    #[ORM\Column]
    private ?int $price = null;

    #[ORM\Column]
    private ?int $stock = null;

   
    
    #[ORM\ManyToOne(inversedBy: 'products')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Categories $categories = null;

    #[ORM\OneToMany(mappedBy: 'products', targetEntity: Images::class, orphanRemoval: true, cascade:['persist'])]
    private Collection $images;

    #[ORM\ManyToMany(targetEntity: Patterns::class, inversedBy: 'products')]
    private Collection $patterns;

    #[ORM\ManyToMany(targetEntity: Sizes::class, inversedBy: 'products')]
    private Collection $size;

    #[ORM\ManyToMany(targetEntity: Colors::class, inversedBy: 'products')]
    private Collection $colors;

   
    public function __construct()
    {
        $this->images = new ArrayCollection();
        $this->patterns = new ArrayCollection();
        $this->size = new ArrayCollection();
        $this->colors = new ArrayCollection();
        
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

    public function getPrice(): ?int
    {
        return $this->price;
    }

    public function setPrice(int $price): static
    {
        $this->price = $price;

        return $this;
    }

    public function getStock(): ?int
    {
        return $this->stock;
    }

    public function setStock(int $stock): static
    {
        $this->stock = $stock;

        return $this;
    }


    public function getCategories(): ?Categories
    {
        return $this->categories;
    }

    public function setCategories(?Categories $categories): static
    {
        $this->categories = $categories;

        return $this;
    }

    /**
     * @return Collection<int, Images>
     */
    public function getImages(): Collection
    {
        return $this->images;
    }

    public function addImage(Images $image): static
    {
        if (!$this->images->contains($image)) {
            $this->images->add($image);
            $image->setProducts($this);
        }

        return $this;
    }

    public function removeImage(Images $image): static
    {
        if ($this->images->removeElement($image)) {
            // set the owning side to null (unless already changed)
            if ($image->getProducts() === $this) {
                $image->setProducts(null);
            }
        }

        return $this;
    }
    /**
     * Get the value of description
     */ 
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set the value of description
     *
     * @return  self
     */ 
    public function setDescription($description)
    {
        $this->description = $description;

        return $this;
    }


    /**
     * @return Collection<int, Patterns>
     */
    public function getPatterns(): Collection
    {
        return $this->patterns;
    }

    public function addPattern(Patterns $pattern): static
    {
        if (!$this->patterns->contains($pattern)) {
            $this->patterns->add($pattern);
        }

        return $this;
    }

    public function removePattern(Patterns $pattern): static
    {
        $this->patterns->removeElement($pattern);

        return $this;
    }

    /**
     * @return Collection<int, Sizes>
     */
    public function getSize(): Collection
    {
        return $this->size;
    }

    public function addSize(Sizes $size): static
    {
        if (!$this->size->contains($size)) {
            $this->size->add($size);
        }

        return $this;
    }

    public function removeSize(Sizes $size): static
    {
        $this->size->removeElement($size);

        return $this;
    }

    /**
     * @return Collection<int, Colors>
     */
    public function getColors(): Collection
    {
        return $this->colors;
    }

    public function addColor(Colors $color): static
    {
        if (!$this->colors->contains($color)) {
            $this->colors->add($color);
        }

        return $this;
    }

    public function removeColor(Colors $color): static
    {
        $this->colors->removeElement($color);

        return $this;
    }

 
}


