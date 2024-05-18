all: 
	tmuxinator teachme_fe
	tmuxinator teachme_be
	tmux new -s ref -d
	tmux attach -t teachme_fe
