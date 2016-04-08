<?php
/**
 * Archive page for programa custom post type
 *
 * Methods for TimberHelper can be found in the /lib sub-directory
 *
 * @package  wp-softcatala
 */
//JS and Styles related to the page


//Template initialization
$templates = array( 'archive-projecte.twig' );

$post = retrieve_page_data( 'projecte' );
$post ? $context['links'] = $post->get_field( 'link' ) : '';

$title = 'En què treballem: ' . single_term_title('', false);

$contextFilterer = new SC_ContextFilterer();
$context = $contextFilterer->get_filtered_context( array( 'title' => $title ) );

$context['post'] = $post;
$context['content_title'] = $title;
$context['post_type'] = $post_type;
$context['sidebar_top'] = Timber::get_widgets('sidebar_top');
$context['sidebar_bottom'] = Timber::get_widgets('sidebar_bottom');
$context['sidebar_elements'] = array( 'static/suggeriment.twig', 'baixades.twig', 'links.twig' );

//Posts and pagination
$args = $wp_query->query;
//Do not include 'arxivat' projects
$args['tax_query'] = array(
    array (
        'taxonomy' => 'classificacio',
        'field' => 'slug',
        'terms' => 'arxivat',
        'operator'  => 'NOT IN'
    )
);
query_posts( $args );
$context['posts'] = Timber::get_posts($args);
$context['pagination'] = Timber::get_pagination();

Timber::render( $templates, $context );
