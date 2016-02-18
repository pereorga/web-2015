<?php
/**
 * Template Name: Traductor Softcatala
 *
 * @package wp-softcatala
 */

wp_enqueue_script( 'sc-js-traductor', get_template_directory_uri() . '/static/js/traductor.js', array('sc-js-main'), '1.0.0', true );
wp_localize_script( 'sc-js-traductor', 'scajax', array(
    'ajax_url' => admin_url( 'admin-ajax.php' )
));

$context = Timber::get_context();
$post = new TimberPost();
$context['post'] = $post;
$context['content_title'] = 'Traductor';
$context['links'] = $post->get_field( 'link' );
$context['sidebar_top'] = Timber::get_widgets('sidebar_top_recursos');
$context['sidebar_elements'] = array( 'static/ajudeu.twig', 'static/dubte_forum.twig', 'baixades.twig', 'links.twig' );
$context['sidebar_bottom'] = Timber::get_widgets('sidebar_bottom_recursos');
Timber::render( array( 'traductor.twig' ), $context );
    
