import type * as RDF from 'rdf-js';

/**
 * A singleton term instance that represents the default graph.
 * It's only allowed to assign a DefaultGraph to the .graph property of a Quad.
 */
export class DefaultGraph implements RDF.DefaultGraph {
  public static INSTANCE = new DefaultGraph();

  public readonly termType = 'DefaultGraph';
  public readonly value = '';

  private constructor() {
    // Private constructor
  }

  public equals(other?: RDF.Term | null): boolean {
    return !!other && other.termType === 'DefaultGraph';
  }
}
