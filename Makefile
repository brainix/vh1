#-----------------------------------------------------------------------------#
#   Makefile                                                                  #
#                                                                             #
#   Copyright © 2017, Rajiv Bakulesh Shah, original author.                   #
#   All rights reserved.                                                      #
#-----------------------------------------------------------------------------#



install upgrade: formulae := {node,heroku}



install:
	-xcode-select --install
	command -v brew >/dev/null 2>&1 || \
		ruby -e "$$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
	brew analytics off
	brew analytics regenerate-uuid
	brew install $(formulae)
	npm install -g create-react-app

upgrade:
	brew update
	-brew upgrade $(formulae)
	brew cleanup
	-heroku update
	npm install -g npm
