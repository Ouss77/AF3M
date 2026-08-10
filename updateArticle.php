<?php
header("Content-Type: application/json");

include '../dbConnexion.php';  // Include your DB connection file

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data['article_id'])) {
    echo json_encode(["error" => "Invalid input"]);
    exit();
}

$article_id = $data['article_id'];
$titre = $data['titre'];
$annee = $data['annee'];
$theme = $data['theme'];
$resume = $data['resume'];
$author_name = $data['author_name'];
$pdf_file = $data['pdf_file'] ?? null;

try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Update the article itself
    $stmt = $pdo->prepare("UPDATE articales
                           SET titre = :titre, annee = :annee, theme = :theme, resume = :resume, pdf_files = :pdf_file
                           WHERE article_id = :article_id");
    $stmt->execute([
        'titre' => $titre,
        'annee' => $annee,
        'theme' => $theme,
        'resume' => $resume,
        'pdf_file' => $pdf_file,
        'article_id' => $article_id,
    ]);

    // Check if author exists, create otherwise (same logic as ajouter_article.php)
    $stmt = $pdo->prepare("SELECT author_id FROM Authors WHERE author_name = :author_name");
    $stmt->execute(['author_name' => $author_name]);
    $author = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($author) {
        $author_id = $author['author_id'];
    } else {
        $stmt = $pdo->prepare("INSERT INTO Authors (author_name) VALUES (:author_name)");
        $stmt->execute(['author_name' => $author_name]);
        $author_id = $pdo->lastInsertId();
    }

    // Replace this article's author link with the (possibly new) author
    $stmt = $pdo->prepare("DELETE FROM Article_Authors WHERE article_id = :article_id");
    $stmt->execute(['article_id' => $article_id]);

    $stmt = $pdo->prepare("INSERT INTO Article_Authors (article_id, author_id)
                           VALUES (:article_id, :author_id)");
    $stmt->execute([
        'article_id' => $article_id,
        'author_id' => $author_id,
    ]);

    echo json_encode(["success" => true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
