# lertroo.github.io

GitHub Pagesで公開しているサイトの一覧ページ。

https://lertroo.github.io/

## サイトを追加するとき
`index.html` の `<ul class="sites">` に `<li>` を1つ追記する。対象サイトは次で洗い出せる。

```
gh api users/lertroo/repos --paginate --jq '.[] | select(.has_pages) | .name'
```
