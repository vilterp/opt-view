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

class ExprTreeView extends Component {
  constructor() {
    super();
    this.state = {
      exprIdx: 0,
    };
  }

  handleChangeExprIdx(delta) {
    // TODO: clamp to valid range
    this.setState({
      exprIdx: this.state.exprIdx + delta,
    });
  }

  renderChooser(exprs) {
    if (exprs.length === 1) {
      return null;
    }

    return (
      <span className="expr-chooser">
        (
        <span
          className={classNames("expr-chooser__button", {"expr-chooser__button--enabled": this.state.exprIdx > 0})}
          onClick={() => this.handleChangeExprIdx(-1)}
        >
          &lt;
        </span>
        {this.state.exprIdx + 1}/{exprs.length}
        <span
          className={classNames("expr-chooser__button", {"expr-chooser__button--enabled": this.state.exprIdx < exprs.length-1})}
          onClick={() => this.handleChangeExprIdx(1)}
        >
          &gt;
        </span>
        )
      </span>
    )
  }

  render() {
    const exprs = this.props.memo[this.props.groupID];
    const chosenExpr = exprs[this.state.exprIdx];

    return (
      <div className="expr-tree-view">
        {chosenExpr.op} {this.renderChooser(exprs)}
        <ul>
          {chosenExpr.args.map((child) => (
            <li>
              {/* TODO: distinguish more robustly between tables and group ids */}
              {typeof child === "string"
                ? <span>{child}</span>
                : <ExprTreeView memo={this.props.memo} groupID={child} />}
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
            this.renderGroup(id, group, this.props.selectedGroupID)
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
      selectedGroupID: null,
    };
  }

  handleSetSelectedGroup = (groupID) => {
    this.setState({
      selectedGroupID: groupID,
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
                  selectedGroupID={this.state.selectedGroupID}
                  onSetSelectedGroup={this.handleSetSelectedGroup}
                />
              </td>
              <td style={{ minWidth: 500, paddingLeft: 50 }}>
                {this.state.selectedGroupID
                  ? <ExprTreeView
                      memo={exampleMemo}
                      groupID={this.state.selectedGroupID}
                    />
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
