'use strict';

(function ($, Ractive, moment) {
  var ractive = new Ractive({
    el: '#page',
    template: '#pageTemplate',
    data: {
      hot_news: [],
      new_news: [],
    },
  });

  var hot_page_count = 1;
  var new_page_count = 1;
  var search_page_count = 1;

  function check_url(url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
  }


  var hot_url = "https://www.reddit.com/hot.json";
  var new_url = "https://www.reddit.com/new.json";
  var search_url = "https://www.reddit.com/search.json";

  function hot_news_list(params){
    if(params){
      params.count = 25*hot_page_count;
    }else{
      params = {};
    }

    $.get(hot_url, params, function(hot_news_data){
      var pass_data = [];
      hot_news_data.data.children.map(function(item){
        if(!item.data.over_18){
          var r = {'title': item.data.title};

          if(check_url(item.data.thumbnail)){
            r.thumbnail = item.data.thumbnail;
          }else if (check_url(item.data.url)){
            r.thumbnail = item.data.url;
          }else{
            r.thumbnail = "img/no_image_available.png";
          }

          r.url = item.data.url;
          r.author = item.data.author;
          r.domain = item.data.domain;
          var created_date_unix = moment().utc(item.data.created_utc);

          r.created_utc = item.data.created_utc;
          r.created = moment(created_date_unix).fromNow();
          r.subreddit_name_prefixed = item.data.subreddit_name_prefixed;
          r.num_comments = item.data.num_comments;
          pass_data.push(r);
        }
      });
    
      var dataset = {'data': pass_data};
      ractive.set('hot_news', {'data': pass_data, 'after': hot_news_data.data.after , 'before': hot_news_data.data.before});
    });
  }


  function new_news_list(params){
    if(params){
      params.count = 25*new_page_count;
    }else{
      params = {};
    }

    $.get(new_url, params, function(new_news_data){
      var pass_data = [];
      new_news_data.data.children.map(function(item){
        if(!item.data.over_18){
          var r = {'title': item.data.title};

          if(check_url(item.data.thumbnail)){
            r.thumbnail = item.data.thumbnail;
          }else if (check_url(item.data.url)){
            r.thumbnail = item.data.url;
          }else{
            r.thumbnail = "img/no_image_available.png";
          }

          r.url = item.data.url;
          r.author = item.data.author;
          r.domain = item.data.domain;
          var created_date_unix = moment().utc(item.data.created_utc);

          r.created_utc = item.data.created_utc;
          r.created = moment(created_date_unix).fromNow();
          r.subreddit_name_prefixed = item.data.subreddit_name_prefixed;
          r.num_comments = item.data.num_comments;
          pass_data.push(r);
        }
      });
      ractive.set('new_news', {'data': pass_data, 'after': new_news_data.data.after , 'before': new_news_data.data.before});
    }); 
  }


  function search_news_list(params){
    if(params){
      params.count = 25*search_page_count;
      params.sort = 'relevance';

    }else{
      params = {};
    }
    $.get(search_url, params, function(search_news_data){
      var pass_data = [];
      search_news_data.data.children.map(function(item){
        if(!item.data.over_18){
          var r = {'title': item.data.title};

          if(check_url(item.data.thumbnail)){
            r.thumbnail = item.data.thumbnail;
          }else if (check_url(item.data.url)){
            r.thumbnail = item.data.url;
          }else{
            r.thumbnail = "img/no_image_available.png";
          }

          r.url = item.data.url;
          r.author = item.data.author;
          r.domain = item.data.domain;
          var created_date_unix = moment().utc(item.data.created_utc);

          r.created_utc = item.data.created_utc;
          r.created = moment(created_date_unix).fromNow();
          r.subreddit_name_prefixed = item.data.subreddit_name_prefixed;
          r.num_comments = item.data.num_comments;
          pass_data.push(r);
        }
      });
      ractive.set('search_news', {'data': pass_data, 'after': search_news_data.data.after , 'before': search_news_data.data.before});
    }); 
  }

  ractive.on('hot_news_after', function(event){
    hot_page_count++;
    var next_value = event.node.dataset.after;
    if(next_value != ""){
      hot_news_list({'after': next_value});
    }
  });


  ractive.on('hot_news_before', function(event){
    hot_page_count--;
    var prev_value = event.node.dataset.before;
    if(prev_value != ""){
      hot_news_list({'before': prev_value});
    }
  });


  ractive.on('new_news_after', function(event){
    new_page_count++;
    var next_value = event.node.dataset.after;
    if(next_value != ""){
      new_news_list({'after': next_value});
    }
  });


  ractive.on('new_news_before', function(event){
    new_page_count--;
    var prev_value = event.node.dataset.before;
    if(prev_value != ""){
      new_news_list({'before': prev_value});
    }
  });


  function trim_search(value){
    return value.replace(/ /g, "+");
  }

  ractive.on('search_feeds', function(event){
    var search_q = $('#search_query').val();
    search_q = trim_search(search_q);
    search_news_list({'q': search_q});
    search_page_count = 1;
  });


  ractive.on('search_news_after', function(event){
    search_page_count++;
    var search_q = $('#search_query').val();
    search_q = trim_search(search_q);

    var next_value = event.node.dataset.after;
    if(next_value != ""){
      search_news_list({'q': search_q, 'after': next_value});
    }
  });


  ractive.on('search_news_before', function(event){
    search_page_count--;
    var search_q = $('#search_query').val();
    search_q = trim_search(search_q);

    var prev_value = event.node.dataset.before;
    if(prev_value != ""){
      search_news_list({'q': search_q, 'before': prev_value});
    }
  });


  hot_news_list(false);
  new_news_list(false);


  $(document).ready(function(){
    $(".button-collapse").sideNav();
    $('.about-me-target').click(function(e){
      e.preventDefault();
      $('.tap-target').tapTarget('open');
    });
  });


})(jQuery, Ractive, moment);












