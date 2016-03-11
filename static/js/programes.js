/** JS functions related to pages from the post_type 'Programa' **/

jQuery( document ).ready(function() {
    var OSName="Unknown OS";
    if (navigator.appVersion.indexOf("Win") != -1) OSName="windows";
    else if (navigator.userAgent.indexOf("Mac") != -1) OSName="osx";
    else if (navigator.userAgent.indexOf("Android") != -1) OSName="android";
    else if (navigator.userAgent.indexOf("Linux") != -1) OSName="linux";
    else if (navigator.userAgent.indexOf("iPad") != -1 || navigator.userAgent.indexOf("iPhone") != -1 || navigator.userAgent.indexOf("iPod") != -1) OSName="ios";

    if(jQuery('#baixada_'+OSName).length) {
        jQuery('#baixada_'+OSName).show();
    } else {
        jQuery('.baixada_boto').first().show();
    }

    var numItems = jQuery('.baixada_boto').length;
    if ( numItems <= 2 ) {
        jQuery("#show_more_versions").hide();
    }
});

/** Cerca **/
jQuery(".selectpicker").on('change', function() {
    jQuery( "#cerca_programes" ).submit();
});

jQuery("#mostra_arxivat").on('click', function() {
    if(jQuery("#arxivat").val() == 1) {
        jQuery("#arxivat").val(0);
    } else {
        jQuery("#arxivat").val(1);
    }

    jQuery( "#cerca_programes" ).submit();
});

/** Rating **/
jQuery('#input_rating').on('change', function () {
    var complexname = jQuery(this).attr('name');
    var name = complexname.split('_');
    var cookie_id = "sc_"+complexname;
    if(document.cookie.indexOf(cookie_id) < 0) {
        //Data
        var post_data = new FormData();
        post_data.append('post_id', name[2]);
        post_data.append('rate', jQuery("#input_rating").val());
        post_data.append('action', 'send_vote');

        jQuery.ajax({
            type: 'POST',
            url: scajax.ajax_url,
            data: post_data,
            dataType: 'json',
            contentType: false,
            processData: false,
            success : form_sent_ok,
            error : form_sent_ko
        });


        var CookieDate = new Date;
        CookieDate.setFullYear(CookieDate.getFullYear( ) +10);
        document.cookie = cookie_id+'=1; expires=' + CookieDate.toGMTString( ) + ';';
    } else {
        var message_text = 'Sembla que ja havies votat abans...';
        show_message(message_text);
    }
});

function form_sent_ok(result) {
    show_message(result.text);
}

function form_sent_ko(result) {
    show_message("S'ha produït un error en enviar les dades. Proveu de nou més tard.");
}

function show_message(text) {
    jQuery("#message_text").html(text);
    jQuery('.bs-messages-modal-lg').modal('show');
}

/** Formulari comprova si programa existeix **/
jQuery(".next_step").on('click', function() {
    var button_id = jQuery(this).attr('id').split('_');
    step = button_id[1];
    jQuery("#form_"+step).hide();
    step++;
    if(step == 3) {
        jQuery("#form_3").addClass('actiu');
    } else {
        jQuery("#form_3").removeClass('actiu');
    }
    jQuery("#form_"+step).show();
});

var $search_program_form = jQuery('#second_step');

$search_program_form.on('submit', function(ev){
    ev.preventDefault();

    jQuery("#loading").fadeIn();
    var nom_programa = jQuery("#nom_programa").val();

    //Data
    var post_data = new FormData();
    post_data.append('nom_programa', nom_programa);
    post_data.append('action', 'search_program');

    jQuery.ajax({
        type: 'POST',
        url: scajax.ajax_url,
        data: post_data,
        dataType: 'json',
        contentType: false,
        processData: false,
        success : form_search_ok,
        error : form_sent_ko
    });
});

function form_search_ok(result) {
    jQuery("#loading").hide();
    if(result.programs) {
        var response = result.text+result.programs;
    } else {
        var response = result.text;
    }
    jQuery("#text_response").html(response);
    jQuery("#pas_2").show();
}

/** Formulari afegeix programa **/
var $add_program_form = jQuery('#programa_form');

$add_program_form.on('submit', function(ev) {
    ev.preventDefault();

    jQuery("#loading_program").fadeIn();

    //Data
    var post_data = new FormData();
    post_data.append('email_usuari', jQuery('input[name=email_usuari]').val());
    post_data.append('comentari_usuari', jQuery('textarea[name=comentari_usuari]').val());
    post_data.append('nom', jQuery('input[name=nom]').val());
    post_data.append('autor_programa', jQuery('input[name=autor]').val());
    post_data.append('lloc_web_programa', jQuery('input[name=lloc_web]').val());
    post_data.append('descripcio', jQuery('textarea[name=descripcio]').val());
    post_data.append('llicencia', jQuery('input[name=llicencia]:checked').val());
    post_data.append('categoria_programa', jQuery('input[name=categoria_programa]:checked').val());
    post_data.append('autor_traduccio', jQuery('textarea[name=autor_traduccio]').val());

    //Programes
    var urls_baixada = [];
    jQuery(".url_baixada").each(function() {
        urls_baixada.push(jQuery(this).val());
    });

    var versions = [];
    jQuery(".versio").each(function() {
        versions.push(jQuery(this).val());
    });

    var sistemes_operatius = [];
    jQuery(".sistema_operatiu").each(function() {
        if(jQuery(this).is(':checked')) {
            sistemes_operatius.push(jQuery(this).val());
        }
    });

    var arquitectures = [];
    jQuery(".arquitectura").each(function() {
        if(jQuery(this).is(':checked')) {
            arquitectures.push(jQuery(this).val());
        }
    });

    var baixades = {};
    urls_baixada.forEach(function (value, i) {
        var values = {};
        values.url = urls_baixada[i];
        values.versio = versions[i];
        values.sistema_operatiu = sistemes_operatius[i];
        values.arquitectura = arquitectures[i];
        baixades[i] = values;
    });

    baixadesjson = JSON.stringify(baixades);

    post_data.append('baixades', baixadesjson);
    post_data.append('action', 'add_new_program');

    var logo = jQuery(document).find('input[name="logo"]');
    var logo_file = logo[0].files[0];
    post_data.append("logo", logo_file);

    var captura = jQuery(document).find('input[name="captura"]');
    var captura_file = captura[0].files[0];
    post_data.append("captura", captura_file);

    jQuery.ajax({
        type: 'POST',
        url: scajax.ajax_url,
        data: post_data,
        dataType: 'json',
        contentType: false,
        processData: false,
        success : form_add_ok,
        error : form_sent_ko
    });
});

function form_add_ok(result) {
    jQuery("#loading_program").hide();
    jQuery("#form_3").hide();
    jQuery("#form_4").fadeIn();
    jQuery("#form_3").removeClass('actiu');
}

jQuery('#add_new_baixada').on('click', function () {
    var content = jQuery('#baixada_fields').prop('outerHTML');
    current_baixada_id = baixada_id;
    baixada_id = baixada_id + 1;
    pattern = "[1]";
    re = new RegExp(pattern, "g");
    res2 = content.replace(re, baixada_id);
    jQuery( "#baixada_group").append(res2);
});

jQuery('#afegeix_programa_button').on('click', function () {
    if (!jQuery('#form_3').hasClass('actiu')) {
        jQuery('#form_4').hide();
        jQuery('#form_2').hide();
        jQuery('#form_1').show();
    }
});

/** Contact form action **/
var $contactForm = jQuery('#report_form');

$contactForm.on('submit', function(ev){
    ev.preventDefault();

    //Data
    var post_data = new FormData();
    post_data.append('nom', jQuery('input[name=nom]').val());
    post_data.append('correu', jQuery('input[name=correu]').val());
    post_data.append('tipus', jQuery('#tipus_contacte option:selected').val());
    post_data.append('comentari', jQuery('#comentari').val());
    post_data.append('to_email', 'avis_rebost@softcatala.org');
    post_data.append('nom_from', 'Rebost de Softcatalà');
    post_data.append('assumpte', '[Programes] Contacte des del formulari');
    post_data.append('action', 'contact_form');

    jQuery.ajax({
        type: 'POST',
        url: scajax.ajax_url,
        data: post_data,
        dataType: 'json',
        contentType: false,
        processData: false,
        success : form_sent_ok,
        error : form_sent_ko
    });
});

function form_sent_ok(dt) {
    if (dt.type == 'message') {
        jQuery("#contingut-formulari").hide();
        jQuery("#contingut-formulari-response").empty().html(dt.text).fadeIn();
    }
}

jQuery('#contact_traductor').click(function() {
    jQuery("#contingut-formulari-response").hide();
    jQuery("textarea[name='comentari']").val('');
    jQuery("#contingut-formulari").show();
});

function form_sent_ko() {
    var message = 'Alguna cosa no ha funcionat bé en enviar les dades al servidor de traducció';
    jQuery("#contingut-formulari").hide();
    jQuery("#contingut-formulari-response").empty().html(message).fadeIn();
}
/** End contact form action **/