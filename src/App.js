import React, { Component } from 'react';
import classNames from "classnames";
import './App.css';

const exampleMemo = {
  1: [
    { op: "join", args: [2, 3] },
    { op: "join", args: [3, 2] },
  ],
  2: [
    { op: "scan", args: ["blog_posts"] },
  ],
  3: [
    { op: "scan", args: ["comments"] },
  ],
};

function extractTree(memo, groupID) {
  // TODO: uh yeah this is an array
  // which one do we show
  const exprs = memo[groupID];
  const chosenExpr = exprs[0];
  return {
    op: chosenExpr.op,
    children: chosenExpr.args.map((arg) => {
      if (typeof arg === "number") {
        return extractTree(memo, arg);
      } else {
        return {
          table: arg
        };
      }
    })
  }
}

class ExprTreeView extends Component {
  render() {
    const node = this.props.node;
    if (node.table) {
      return <span>{node.table}</span>
    }
    return (
      <div className="expr-tree-view">
        {node.op}
        <ul>
          {node.children.map((child) => (
            <li>
              <ExprTreeView node={child} />
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

// ExprView shows a single expression node in the memo.
// i.e. with ids referencing other memo nodes.
class ExprView extends Component {
  render() {
    const expr = this.props.expr;
    return (
      <pre className="expr-view">({expr.op} {expr.args.join(" ")})</pre>
    );
  }
}

class MemoView extends Component {
  handleSetSelectedGroup = (groupID) => {
    this.props.onSetSelectedGroup(groupID);
  }

  renderGroup(id, group, selectedGroupID) {
    const isSelected = id === selectedGroupID;
    const onClick = () => isSelected
      ? this.handleSetSelectedGroup(null)
      : this.handleSetSelectedGroup(id);

    return (
      <tr key={id}>
        <td
          className={classNames(
            "memo-view__group-id",
            { "memo-view__group-id--selected": isSelected },
          )}
          onClick={onClick}
        >
          {id}
        </td>
        <td className="group-view">
          <ul>
            {group.map((expr, idx) => (
              <li key={idx}>
                <ExprView expr={expr} />
              </li>
            ))}
          </ul>
        </td>
      </tr>
    );
  }

  render() {
    return (
      <table className="memo-view">
        <thead>
          <tr>
            <th>Group ID</th>
            <th>Group</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(this.props.memo).map(([id, group]) => (
            this.renderGroup(id, group, this.props.selectedGroup)
          ))}
        </tbody>
      </table>
    )
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      selectedGroup: null,
    };
  }

  handleSetSelectedGroup = (groupID) => {
    this.setState({
      selectedGroup: groupID,
    });
  }

  render() {
    return (
      <div>
        <h1>Opt View</h1>
        <table>
          <thead>
            <tr>
              <th>Memo</th>
              <th>Selected Expr</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{verticalAlign: "top"}}>
              <td>
                <MemoView
                  memo={exampleMemo}
                  selectedGroup={this.state.selectedGroup}
                  onSetSelectedGroup={this.handleSetSelectedGroup}
                />
              </td>
              <td style={{ minWidth: 500, paddingLeft: 50 }}>
                {this.state.selectedGroup
                  ? <ExprTreeView node={extractTree(exampleMemo, this.state.selectedGroup)} />
                  : null}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;
