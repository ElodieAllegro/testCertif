<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230701064751 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE categories (id INT AUTO_INCREMENT NOT NULL, parent_id INT DEFAULT NULL, name VARCHAR(255) NOT NULL, category_order INT NOT NULL, slug VARCHAR(255) NOT NULL, INDEX IDX_3AF34668727ACA70 (parent_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE colors (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(50) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE colors_products (colors_id INT NOT NULL, products_id INT NOT NULL, INDEX IDX_501559435C002039 (colors_id), INDEX IDX_501559436C8A81A9 (products_id), PRIMARY KEY(colors_id, products_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE images (id INT AUTO_INCREMENT NOT NULL, products_id INT DEFAULT NULL, name VARCHAR(255) NOT NULL, INDEX IDX_E01FBE6A6C8A81A9 (products_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE patterns (id INT AUTO_INCREMENT NOT NULL, img_id INT DEFAULT NULL, ref VARCHAR(255) DEFAULT NULL, UNIQUE INDEX UNIQ_11ADDDD0C06A9F55 (img_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE products (id INT AUTO_INCREMENT NOT NULL, categories_id INT NOT NULL, name VARCHAR(255) NOT NULL, description VARCHAR(255) NOT NULL, price INT NOT NULL, stock INT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', slug VARCHAR(255) NOT NULL, INDEX IDX_B3BA5A5AA21214B7 (categories_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE products_patterns (products_id INT NOT NULL, patterns_id INT NOT NULL, INDEX IDX_4ACCD636C8A81A9 (products_id), INDEX IDX_4ACCD6377399416 (patterns_id), PRIMARY KEY(products_id, patterns_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE products_sizes (products_id INT NOT NULL, sizes_id INT NOT NULL, INDEX IDX_56C779B96C8A81A9 (products_id), INDEX IDX_56C779B9423285E6 (sizes_id), PRIMARY KEY(products_id, sizes_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE sizes (id INT AUTO_INCREMENT NOT NULL, value VARCHAR(3) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE users (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, lastname VARCHAR(50) NOT NULL, firstname VARCHAR(100) NOT NULL, address VARCHAR(255) NOT NULL, zipcode VARCHAR(5) NOT NULL, city VARCHAR(255) NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', UNIQUE INDEX UNIQ_1483A5E9E7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE messenger_messages (id BIGINT AUTO_INCREMENT NOT NULL, body LONGTEXT NOT NULL, headers LONGTEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', available_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', delivered_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_75EA56E0FB7336F0 (queue_name), INDEX IDX_75EA56E0E3BD61CE (available_at), INDEX IDX_75EA56E016BA31DB (delivered_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE categories ADD CONSTRAINT FK_3AF34668727ACA70 FOREIGN KEY (parent_id) REFERENCES categories (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE colors_products ADD CONSTRAINT FK_501559435C002039 FOREIGN KEY (colors_id) REFERENCES colors (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE colors_products ADD CONSTRAINT FK_501559436C8A81A9 FOREIGN KEY (products_id) REFERENCES products (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE images ADD CONSTRAINT FK_E01FBE6A6C8A81A9 FOREIGN KEY (products_id) REFERENCES products (id)');
        $this->addSql('ALTER TABLE patterns ADD CONSTRAINT FK_11ADDDD0C06A9F55 FOREIGN KEY (img_id) REFERENCES images (id)');
        $this->addSql('ALTER TABLE products ADD CONSTRAINT FK_B3BA5A5AA21214B7 FOREIGN KEY (categories_id) REFERENCES categories (id)');
        $this->addSql('ALTER TABLE products_patterns ADD CONSTRAINT FK_4ACCD636C8A81A9 FOREIGN KEY (products_id) REFERENCES products (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE products_patterns ADD CONSTRAINT FK_4ACCD6377399416 FOREIGN KEY (patterns_id) REFERENCES patterns (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE products_sizes ADD CONSTRAINT FK_56C779B96C8A81A9 FOREIGN KEY (products_id) REFERENCES products (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE products_sizes ADD CONSTRAINT FK_56C779B9423285E6 FOREIGN KEY (sizes_id) REFERENCES sizes (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE categories DROP FOREIGN KEY FK_3AF34668727ACA70');
        $this->addSql('ALTER TABLE colors_products DROP FOREIGN KEY FK_501559435C002039');
        $this->addSql('ALTER TABLE colors_products DROP FOREIGN KEY FK_501559436C8A81A9');
        $this->addSql('ALTER TABLE images DROP FOREIGN KEY FK_E01FBE6A6C8A81A9');
        $this->addSql('ALTER TABLE patterns DROP FOREIGN KEY FK_11ADDDD0C06A9F55');
        $this->addSql('ALTER TABLE products DROP FOREIGN KEY FK_B3BA5A5AA21214B7');
        $this->addSql('ALTER TABLE products_patterns DROP FOREIGN KEY FK_4ACCD636C8A81A9');
        $this->addSql('ALTER TABLE products_patterns DROP FOREIGN KEY FK_4ACCD6377399416');
        $this->addSql('ALTER TABLE products_sizes DROP FOREIGN KEY FK_56C779B96C8A81A9');
        $this->addSql('ALTER TABLE products_sizes DROP FOREIGN KEY FK_56C779B9423285E6');
        $this->addSql('DROP TABLE categories');
        $this->addSql('DROP TABLE colors');
        $this->addSql('DROP TABLE colors_products');
        $this->addSql('DROP TABLE images');
        $this->addSql('DROP TABLE patterns');
        $this->addSql('DROP TABLE products');
        $this->addSql('DROP TABLE products_patterns');
        $this->addSql('DROP TABLE products_sizes');
        $this->addSql('DROP TABLE sizes');
        $this->addSql('DROP TABLE users');
        $this->addSql('DROP TABLE messenger_messages');
    }
}
