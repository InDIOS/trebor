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
  _allDone: false,
	editedTodo: null,
	get remaining() {
		return this.$filters.actives(this.todos).length;
	},
  get allDone() {
    return this._allDone || this.remaining === 0;
  },
  set allDone(value: boolean) {
    this._allDone = value;
  },
  mark(item: number, value: boolean) {
    this.$set(`todos.${item}.completed`, value);
    this.$set('allDone', this.remaining === 0);
  },
	markAll(value: boolean) {
    this.todos.forEach(todo => { todo.completed = value; });
    this.$set('allDone', value);
	},
  addTodo() {
			const title = this.newTodo && this.newTodo.trim();
    if (!title) return;
			this.newTodo = '';
    this.todos.push({ title: title, completed: false });
    this.$set('allDone', this.remaining === 0);
	},
	editTodo(todo: Todo) {
		this.editedTodo = todo;
		this.oldTitle = todo.title;
    this.$update();
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
    this.$set('allDone', this.remaining === 0);
	},
	removeCompleted() {
    this.$set('todos', this.$filters.actives(this.todos));
	},
	clearTmps() {
		this.editedTodo = null;
		this.oldTitle = '';
    this.$update();
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