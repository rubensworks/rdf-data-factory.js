import * as RDF from 'rdf-js';

/**
 * A variable name.
 */
export class Variable implements RDF.Variable {
  public readonly termType = 'Variable';
  public readonly value: string;

  public constructor(value: string) {
    this.value = value;
  }

  public equals(other: RDF.Term | null | undefined): boolean {
    return !!other && other.termType === 'Variable' && other.value === this.value;
  }
}
