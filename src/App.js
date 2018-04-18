import React, { Component } from 'react';
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

function extractTree(memo, rootID) {
  // TODO: uh yeah this is an array
  // which one do we show
  const rootNode = memo[rootID][0];
  return {
    op: rootNode.op,
    children: rootNode.args.map((arg) => {
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
  handleHighlightGroup = (groupID) => {
    this.props.onHighlightGroup(groupID);
  }

  handleUnHighlightGroup = () => {
    this.props.onUnHighlightGroup();
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
            <tr key={id}>
              <td
                className="memo-view__group-id"
                onMouseOver={() => this.handleHighlightGroup(id)}
                onMouseOut={() => this.handleUnHighlightGroup()}
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
      highlightedGroup: null,
    };
  }

  handleHighlightGroup = (groupID) => {
    this.setState({
      highlightedGroup: groupID,
    });
  }

  handleUnHighlightGroup = () => {
    this.setState({
      highlightedGroup: null,
    });
  }

  render() {
    return (
      <div>
        <h1>Opt View</h1>
        <MemoView
          memo={exampleMemo}
          onHighlightGroup={this.handleHighlightGroup}
          onUnHighlightGroup={this.handleUnHighlightGroup}
        />
        {this.state.highlightedGroup
          ? <ExprTreeView node={extractTree(exampleMemo, this.state.highlightedGroup)} />
          : null}
      </div>
    );
  }
}

export default App;
