<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230704090303 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE images ADD pattern_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE images ADD CONSTRAINT FK_E01FBE6AF734A20F FOREIGN KEY (pattern_id) REFERENCES patterns (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_E01FBE6AF734A20F ON images (pattern_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE images DROP FOREIGN KEY FK_E01FBE6AF734A20F');
        $this->addSql('DROP INDEX UNIQ_E01FBE6AF734A20F ON images');
        $this->addSql('ALTER TABLE images DROP pattern_id');
    }
}
