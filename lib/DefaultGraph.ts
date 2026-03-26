import type * as RDF from '@rdfjs/types';

/**
 * A singleton term instance that represents the default graph.
 * It's only allowed to assign a DefaultGraph to the .graph property of a Quad.
 */
export class DefaultGraph implements RDF.DefaultGraph {
  // eslint-disable-next-line ts/naming-convention
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
