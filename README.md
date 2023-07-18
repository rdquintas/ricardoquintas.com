
This is the repo for the website:

# [ricardoquintas.com](http://www.ricardoquintas.com)

Para testar no GITHUB (branch MASTER)

[http://rdquintas.github.io/ricardoquintas.com](http://rdquintas.github.io/ricardoquintas.com)


## Some details
- uses [git-ftp](https://github.com/git-ftp/git-ftp) to deploy using FTP from the console 


## How to deploy with GIT FTP ?

- ### Setup
  ``git config git-ftp.url "ftp://ftp.example.net:21/public_html"``

  ``git config git-ftp.user "ftp-user"``
  
  ``git config git-ftp.password "secr3t"``

- ### Or if the files are already there
  ``git ftp catchup``

- ### Work and deploy
  ``echo "new content" >> index.txt``

  ``git commit index.txt -m "Add new content"``

  ``git ftp push``