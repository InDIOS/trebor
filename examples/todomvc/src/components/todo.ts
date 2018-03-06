interface Todo {
	title: string;
	completed: boolean;
}

const filters = {
	actives(todos: Todo[]) {
		return todos.filter(todo => !todo.completed);
	},
	filterByView(todos: Todo[], view: string) {
		switch (view) {
			case 'active':
				return todos.filter(todo => !todo.completed);
			case 'completed':
				return todos.filter(todo => todo.completed);
			default:
				return todos;
		}
	},
	pluralize(word: string, count: number) {
		return `${word}${count > 1 ? 's' : ''}`;
	}
};

const model = {
	view: '',
	todos: [],
	newTodo: '',
	oldTitle: '',
	allDone: false,
	editedTodo: null,
	get remaining() {
		return this.$filters.actives(this.todos).length;
	},
	markAll(value: boolean) {
		this.allDone = value;
		this.todos.forEach(todo => { todo.completed = this.allDone; });
	},
	addTodo(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			const title = this.newTodo && this.newTodo.trim();
			if (!title)
				return;
			this.todos.push({ title: title, completed: false });
			this.newTodo = '';
		}
	},
	editTodo(todo: Todo) {
		this.editedTodo = todo;
		this.oldTitle = todo.title;
	},
	doneEdit(todo: Todo, e: KeyboardEvent) {
		if (e.key === 'Enter') {
			todo.title = todo.title.trim();
			if (!todo.title) {
				this.removeTodo(todo);
			}
			this.clearTmps();
		} else if (e.key === 'Escape') {
			todo.title = this.oldTitle;
			this.clearTmps();
		}
	},
	removeTodo(todo: Todo) {
		const index = this.todos.indexOf(todo);
		this.todos.splice(index, 1);
	},
	removeCompleted() {
		this.todos = this.$filters.actives(this.todos);
	},
	clearTmps() {
		this.editedTodo = null;
		this.oldTitle = '';
	}
};

const directives = {
	'focus-edit': function (_inst, options, el) {
		if (options.value) {
			el.focus();
		}
	}
};

export default { model, filters, directives };