#-----------------------------------------------------------------------------#
#   Makefile                                                                  #
#                                                                             #
#   Copyright © 2017, Rajiv Bakulesh Shah, original author.                   #
#   All rights reserved.                                                      #
#-----------------------------------------------------------------------------#



install upgrade: formulae := {node,heroku}
heroku: app ?= vh1



.PHONY: install
install: init heroku

.PHONY: init
init:
	-xcode-select --install
	brew analytics off
	brew analytics regenerate-uuid
	brew tap heroku/brew
	-brew install $(formulae)
	npm install -g create-react-app
	npm install

.PHONY: upgrade
upgrade:
	brew update
	-brew upgrade $(formulae)
	brew cleanup
	-heroku update
	npm install -g npm
	npm install npm
	npm prune
	-npm outdated
	npm update --save-dev
	npm update --save
	-npm outdated
	git status
	git diff

.PHONY: heroku
heroku:
	heroku login
	heroku git:remote -a $(app)
