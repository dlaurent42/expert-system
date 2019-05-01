import { remove, cloneDeep, find } from 'lodash';

class Tree {
  constructor(query, rules, variables) {
    this.length = 0;
    this.lvlMax = 0;
    this.query = query;
    this.rules = rules;
    this.branches = [];
    this.variables = Object.assign(...variables);
  }

  build() {

    // Rearrange variables
    const newVariables = {};
    Object.entries(this.variables).forEach((entry) => {
      const [key, value] = entry;
      newVariables[key] = {
        value,
        evaluated: false,
      };
    });
    this.variables = Object.assign(newVariables);

    // Define an id to identify parents
    let branchId = 0;

    // Initialize tree with rules relative to query
    this.rules.forEach((rule) => {
      if (rule.assignedTo === this.query) {
        this.branches.push(Object.assign(rule, {
          branchId,
          lvl: 0,
          hasParent: false,
          hasChildren: undefined,
        }));
        branchId += 1;
      }
    });

    // Remove rules relative to query (optimization)
    remove(this.rules, { assignedTo: this.query });

    // Stop condition is when old len and new len are identical
    let oldLength = this.length;
    this.length = this.branches.length;
    while (oldLength !== this.length) {

      // Set old length
      oldLength = this.length;

      // Loop through tree
      this.branches.forEach((branch) => {

        // Check if branch has already been explored
        if (typeof branch.hasChildren === 'boolean') return;

        // Loop through variables involved
        branch.variablesInvolved.forEach((variable) => {

          // For each variable involved, check if a rule exists
          this.rules.forEach((rule) => {

            // Check if rule exists for this variable
            if (rule.assignedTo !== variable) return;

            // Check recursively if rule is not already part of the tree we add it
            let inTree = false;
            let currentBranch = (branch.lvl === 0)
              ? cloneDeep(branch)
              : cloneDeep(find(this.branches, { branchId: branch.parentId }));
            while (currentBranch.lvl !== 0) {
              if (currentBranch.ruleId === branch.ruleId) inTree = true;
              currentBranch = cloneDeep(find(this.branches, { branchId: currentBranch.parentId }));
            }
            if (inTree) return;

            // Add rule to tree
            this.branches[branchId] = Object.assign(rule, {
              branchId,
              lvl: branch.lvl + 1,
              hasParent: true,
              parentId: branch.branchId,
              hasChildren: undefined,
            });

            // Assess level max
            this.lvlMax = Math.max(branch.lvl + 1, this.lvlMax);

            Object.assign(branch, { hasChildren: true });
            branchId += 1;
          });
        });

        // If hasChildren has not been set during loop then it means there is no child
        if (typeof branch.hasChildren !== 'boolean') Object.assign(branch, { hasChildren: false });
      });

      // Assess new length
      this.length = this.branches.length;
    }
  }
}

export default Tree;
