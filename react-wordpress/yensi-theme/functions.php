<?php
function yensi_theme_enqueue_assets() {
    $theme_dir = get_template_directory_uri();
    wp_enqueue_style('yensi-style', $theme_dir . '/assets/index.css');
    wp_enqueue_script('yensi-script', $theme_dir . '/assets/index.js', [], null, true);
}
add_action('wp_enqueue_scripts', 'yensi_theme_enqueue_assets');
