# denops-ripgrep.vim
Vim plugin for [ripgrep](https://github.com/BurntSushi/ripgrep).
This plugin just wrapping ripgrep, so you can use `:Ripgrep` like a `rg`.

## Usage
```vim
" greping word "gorilla" in current directory.
:Ripgrep -i -w gorilla

" greping word "gorilla" in parent directory.
:Ripgrep gorilla ../
```

## Author
skanehira
