# EmbedTumblrPosts

HTML文書中にTumblrを使用している任意のブログのポストを埋め込みます。まだ未完成で設定ファイルを読み込む箇所しか実装されていません。1.0.0になるまで頑張ります。

## Example

    <section>
      <h1>New topics</h1>
      <script src="https://raw.github.com/tateya/embed-tumblr-posts/master/embed-tumblr-posts.js?api_key=<TUMBLR_CONSUMER_KEY>">{
      "base-hostname": "example.com",
      "tag": "topic",
      "limit": 10,
      "template":
        "layout": "<ol>${posts}</ol>",
        "posts": "<li><a href="${uri}">${title}</a></li>"
      }
    }</script>
      <noscript>
        <p><a href="http://example.com/tagged/topic">Topics</a></p>
      </noscript>
    </section>
