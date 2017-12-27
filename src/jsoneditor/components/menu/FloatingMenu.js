import { createElement as h, PureComponent } from 'react'
import PropTypes from 'prop-types'

const MENU_CLASS_NAME = 'jsoneditor-floating-menu'
const MENU_ITEM_CLASS_NAME = 'jsoneditor-floating-menu-item'

// Array:             Sort | Map | Filter | Duplicate | Cut | Copy | Paste | Remove
//                         advanced sort (asc, desc, nested fields, custom comparator)
//                         sort, map, filter, open a popup covering the editor (not the whole page)
//                         (or if it's small, can be a dropdown)
// Object:            Sort | Duplicate | Cut | Copy | Paste | Remove
//                         simple sort (asc/desc)
// Value:             [x] String | Duplicate | Cut | Copy | Paste | Remove
//                         String is a checkmark
// Between:           Insert Structure | Insert Value | Insert Object | Insert Array | Paste
//    inserting (value selected):  [field] [value]
//    inserting (array selected):  (immediately show the "Between" menu to create the first item)
//    inserting (object selected): (immediately show the "Between" menu to create the first property)
//
// Selection:          Duplicate | Cut | Copy | Paste | Remove
//
// menu must have vertical orientation on small screens?
//
// icons
//   cut
//   copy
//   paste
//   duplicate
//   remove
//   sort
//   transform   ???  -> filter? cog?
//   undo
//   redo
//   expand    ???
//   collapse  ???
//   format/compact ???
//
//   https://github.com/FortAwesome/Font-Awesome/wiki/Customize-Font-Awesome
//   http://fontastic.me/
//   --> have to create my own icons I guess :(

// TODO: show quick keys in the title of the menu items
const CREATE_TYPE = {
  sort: (path, emit) => h('button', {
    key: 'sort',
    className: MENU_ITEM_CLASS_NAME,
    onClick: () => emit('sort', {path}),
    title: 'Sort'
  }, 'Sort'),

  duplicate: (path, emit) => h('button', {
    key: 'duplicate',
    className: MENU_ITEM_CLASS_NAME,
    onClick: () => emit('duplicate'),
    title: 'Duplicate'
  }, 'Duplicate'),

  cut: (path, emit) => h('button', {
    key: 'cut',
    className: MENU_ITEM_CLASS_NAME,
    onClick: () => emit('cut'),
    title: 'Cut'
  }, 'Cut'),

  copy: (path, emit) => h('button', {
    key: 'copy',
    className: MENU_ITEM_CLASS_NAME,
    onClick: () => emit('copy'),
    title: 'Copy'
  }, 'Copy'),

  paste: (path, emit) => h('button', {
    key: 'paste',
    className: MENU_ITEM_CLASS_NAME,
    onClick: () => emit('paste'),
    title: 'Paste'
  }, 'Paste'),

  remove: (path, emit) => h('button', {
    key: 'remove',
    className: MENU_ITEM_CLASS_NAME,
    onClick: () => emit('remove'),
    title: 'Remove'
  }, 'Remove'),

  insertStructure: (path, emit) => h('button', {
    key: 'insertStructure',
    className: MENU_ITEM_CLASS_NAME,
    onClick: () => emit('insertStructure', {path}),
    title: 'Insert a new object with the same data structure as the item above'
  }, 'Insert structure'),

  insertValue: (path, emit) => h('button', {
    key: 'insertValue',
    className: MENU_ITEM_CLASS_NAME,
    onClick: () => emit('insert', {path, type: 'value'}),
    title: 'Insert value'
  }, 'Insert value'),

  insertObject: (path, emit) => h('button', {
    key: 'insertObject',
    className: MENU_ITEM_CLASS_NAME,
    onClick: () => emit('insert', {path, type: 'Object'}),
    title: 'Insert Object'
  }, 'Insert Object'),

  insertArray: (path, emit) => h('button', {
    key: 'insertArray',
    className: MENU_ITEM_CLASS_NAME,
    onClick: () => emit('insert', {path, type: 'Array'}),
    title: 'Insert Array'
  }, 'Insert Array'),

}

export default class FloatingMenu extends PureComponent {
  // TODO: use or cleanup
  // componentDidMount () {
  //   setTimeout(() => {
  //     const firstButton = this.refs.root && this.refs.root.querySelector('button')
  //     // TODO: find a better way to ensure the JSONEditor has focus so the quickkeys work
  //     // console.log(document.activeElement)
  //     if (firstButton && document.activeElement === document.body) {
  //       firstButton.focus()
  //     }
  //   })
  // }

  static propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.string.isRequired,
          PropTypes.shape({
            type: PropTypes.string.isRequired
          })
        ]).isRequired
    ).isRequired
  }

  render () {
    const items = this.props.items.map(item => {
      const type = typeof item === 'string' ? item : item.type
      const createType = CREATE_TYPE[type]
      if (createType) {
        return createType(this.props.path, this.props.emit)
      }
      else {
        throw new Error('Unknown type of menu item for floating menu: ' + JSON.stringify(item))
      }
    })

    return h('div', {
      className: MENU_CLASS_NAME,
      onMouseDown: this.handleTouchStart,
      onTouchStart: this.handleTouchStart,
    }, items)
  }

  handleTouchStart = (event) => {
    event.stopPropagation()
  }
}